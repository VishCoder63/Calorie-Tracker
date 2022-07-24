import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Food } from '../../entities/food.entity';
import { IAuth } from '../../utils/auth.decorator';
import { Between } from 'typeorm';
import * as moment from 'moment';
import { Role } from '../../enums/role.enum';

@Injectable()
export class FoodService {
  async getFoods({ startDate, endDate, page }, auth: IAuth) {
    const limit = 8;
    if (startDate && !endDate) endDate = new Date(Date.now());
    else if (!startDate && endDate)
      throw new BadRequestException('Please enter Start date');
    else if (startDate > endDate)
      throw new BadRequestException('Start date must be less than End date');

    const userRole = {};
    if (auth.role === Role.User) userRole['userId'] = auth.id;

    if (!startDate && !endDate) {
      return Food.find({
        where: { ...userRole },
        take: limit,
        skip: (page - 1) * limit,
      });
    } else {
      const start_date = moment(startDate).format('YYYY-MM-DD');
      const end_date = moment(endDate).format('YYYY-MM-DD');
      console.log(start_date, end_date);
      return Food.find({
        where: {
          date: Between(start_date, end_date),
          ...userRole,
        },
        take: limit,
        skip: (page - 1) * limit,
      });
    }
  }
  async createFood(body, auth: IAuth) {
    body = {
      ...body,
      date: moment(body.datetime).format('YYYY-MM-DD'),
      month: moment(body.datetime).format('YYYY-MM'),
      time: moment(body.datetime).format('HH:mm'),
      userId: auth.id,
    };
    try {
      const food = new Food();
      const { name, calorie, price, date, month, time, userId } = body;
      food.name = name;
      food.date = date;
      food.month = month;
      food.time = time;
      food.calorie = calorie;
      food.price = price;
      food.userId = userId;
      food.dailyTotalCalorie = 0;
      food.monthlyTotalAmount = 0;
      await food.save();
      await this.dbUpdate(food, 'add');
      return {
        statusCode: HttpStatus.CREATED,
        mesage: 'Created successfully!',
      };
    } catch (e) {
      return new HttpException(e.message, 400);
    }
  }

  async deleteFood(id: number, auth: IAuth) {
    const foodItem = await Food.findOne({ where: { id } });
    if (!foodItem) throw new BadRequestException();

    if (auth.role === Role.User && foodItem.userId != auth.id)
      throw new UnauthorizedException();

    try {
      await Food.delete(id);
      await this.dbUpdate(foodItem, 'delete');
      return {
        statusCode: HttpStatus.OK,
        message: 'Deleted successfully!',
      };
    } catch (e) {
      return new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async updateFood(id: number, body, auth: IAuth) {
    try {
      if (body.datetime) {
        body = {
          ...body,
          date: moment(body.datetime).format('YYYY-MM-DD'),
          month: moment(body.datetime).format('YYYY-MM'),
          time: moment(body.datetime).format('HH:mm'),
        };
        delete body.datetime;
      }

      const food = await Food.findOne({ where: { id } });
      if (!food) throw new BadRequestException();
      if (auth.role === Role.User && food.userId != auth.id)
        throw new UnauthorizedException();
      await this.dbUpdate(food, 'delete');
      await Food.update(id, body);
      const food2 = await Food.findOne({ where: { id } });
      await this.dbUpdate(food2, 'add');
      return {
        statusCode: HttpStatus.OK,
        message: 'Updated successfully!',
      };
    } catch (e) {
      return new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async dbUpdate(body, operation) {
    const { calorie, price, date, month, userId } = body;
    const prevFoodEnteries = await Food.find({
      where: {
        userId,
        date,
      },
    });

    prevFoodEnteries.map((entry) => {
      operation == 'add'
        ? (entry.dailyTotalCalorie += calorie)
        : (entry.dailyTotalCalorie -= calorie);
    });
    const matchedFood = prevFoodEnteries.filter((item) => item.id == body.id);
    if (operation === 'add') {
      matchedFood[0].dailyTotalCalorie = prevFoodEnteries[0].dailyTotalCalorie;
    } else {
      if (matchedFood[0]) matchedFood[0].dailyTotalCalorie = 0;
    }

    await Food.save(prevFoodEnteries);
    const prevBudgetEnteries = await Food.find({
      where: {
        userId,
        month,
      },
    });
    prevBudgetEnteries.map((entry) => {
      operation == 'add'
        ? (entry.monthlyTotalAmount += price)
        : (entry.monthlyTotalAmount -= price);
    });

    const matchedBudget = prevBudgetEnteries.filter(
      (item) => item.id == body.id,
    );
    if (operation === 'add') {
      matchedBudget[0].monthlyTotalAmount =
        prevBudgetEnteries[0].monthlyTotalAmount;
    } else {
      if (matchedBudget[0]) matchedBudget[0].monthlyTotalAmount = 0;
    }
    await Food.save(prevBudgetEnteries);
    return { prevBudgetEnteries, prevFoodEnteries };
  }
}
