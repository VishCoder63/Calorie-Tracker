import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Food } from '../../entities/food.entity';
import { IAuth } from '../../utils/auth.decorator';
import { Between, In } from 'typeorm';
import * as moment from 'moment';
import { Role } from '../../enums/role.enum';
import { User } from '../../entities/user.entity';

@Injectable()
export class FoodService {
  private async validateUser(id: number, auth: IAuth) {
    const foodItem = await Food.findOne({ where: { id } });
    if (!foodItem) throw new BadRequestException();

    if (auth.role === Role.User && foodItem.userId != auth.id)
      throw new UnauthorizedException();
    return foodItem;
  }
  async getFoods({ startDate, endDate, page }, auth: IAuth) {
    const limit = 5;
    if (startDate && !endDate) endDate = new Date(Date.now());
    else if (!startDate && endDate)
      throw new BadRequestException('Please enter Start date');
    else if (startDate > endDate)
      throw new BadRequestException('Start date must be less than End date');
    //make one query
    const userRole = {};
    if (auth.role === Role.User) userRole['userId'] = auth.id;

    if (!startDate && !endDate) {
      return Food.find({
        where: { ...userRole },
        take: limit,
        skip: (page - 1) * limit,
      });
    } else {
      const startDateMoment = moment(startDate).format('YYYY-MM-DD');
      const endDateMoment = moment(endDate).format('YYYY-MM-DD');
      console.log(startDateMoment, endDateMoment);
      return Food.find({
        where: {
          date: Between(startDateMoment, endDateMoment),
          ...userRole,
        },
        take: limit,
        skip: (page - 1) * limit,
      });
    }
  }

  async createFood(body, auth: IAuth) {
    try {
      const food = new Food();
      const { name, calorie, price, datetime } = body;
      food.name = name;
      food.date = moment(datetime).format('YYYY-MM-DD');
      food.month = moment(datetime).format('YYYY-MM');
      food.time = moment(datetime).format('HH:mm');
      food.calorie = calorie;
      food.price = price;
      food.userId = auth.id;
      await food.save();
      await this.updateDbAfterOperation(food.userId, food.date);
      return {
        data: food,
      };
    } catch (e) {
      return new HttpException(e.message, 400);
    }
  }

  async updateDbAfterOperation(userId: number, date: string) {
    try {
      const month = moment(date).format('YYYY-MM');
      const dailyCalSum = await Food.createQueryBuilder('food')
        .select('SUM(food.calorie)', 'sum')
        .where('food.date=:date', { date: date })
        .andWhere('food.userId=:userId', { userId: userId })
        .getRawMany();

      if (dailyCalSum[0].sum != null) {
        await Food.update(
          { userId, date },
          { dailyTotalCalorie: dailyCalSum[0].sum?.toFixed(2) },
        );
      }
      const monthlyBudgetSum = await Food.createQueryBuilder('food')
        .select('SUM(food.price)', 'sum')
        .where('food.month=:month', { month: month })
        .andWhere('food.userId=:userId', { userId: userId })
        .getRawMany();

      if (monthlyBudgetSum[0].sum != null) {
        await Food.update(
          { userId, month },
          { monthlyTotalAmount: monthlyBudgetSum[0].sum?.toFixed(2) },
        );
      }
    } catch (e) {
      throw new HttpException(e.message, 400);
    }
  }

  async deleteFood(id: number, auth: IAuth) {
    try {
      const foodItem = await this.validateUser(id, auth);
      await Food.delete(id);
      await this.updateDbAfterOperation(foodItem.userId, foodItem.date);
      return {
        message: 'Deleted successfully!',
      };
    } catch (e) {
      return new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async updateFood(id: number, body, auth: IAuth) {
    const food = await this.validateUser(id, auth);
    body = { ...food, ...body };
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
      await Food.update(id, {
        calorie: 0,
        price: 0,
      });
      await this.updateDbAfterOperation(food.userId, food.date);

      await Food.update(id, body);
      await this.updateDbAfterOperation(
        food.userId,
        body.date ? body.date : food.date,
      );

      return {
        statusCode: HttpStatus.OK,
        message: 'Updated successfully!',
      };
    } catch (e) {
      return new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getStats() {
    // if (auth.role != Role.Admin) throw new UnauthorizedException();
    const today = moment().format('YYYY-MM-DD');
    const thisWeekEnd = moment().subtract(6, 'days').format('YYYY-MM-DD');
    const prevWeekEnd = moment().subtract(7, 'days').format('YYYY-MM-DD');
    const prevWeekStart = moment().subtract(14, 'days').format('YYYY-MM-DD');
    try {
      const thisWeekEntries = await Food.count({
        where: { date: Between(thisWeekEnd, today) },
      });

      const prevWeekEntries = await Food.count({
        where: { date: Between(prevWeekStart, prevWeekEnd) },
      });

      const avgCal = await Food.createQueryBuilder('food')
        .select('food.userId')
        .addSelect('AVG(food.calorie)', 'avg')
        .groupBy('food.userId')
        .where('food.date>=:from', { from: prevWeekEnd })
        .andWhere('food.date<=:till', { till: today })
        .getRawMany();
      const idArray = avgCal.map((cal) => cal.food_userId);
      const users = await User.find({
        where: { id: In(idArray) },
      });

      const userIDtoCal = {};
      for (let i = 0; i < avgCal.length; i++) {
        userIDtoCal[avgCal[i].food_userId] = avgCal[i].avg.toFixed(2);
      }

      for (const user of users) {
        user['avgcal'] = userIDtoCal[user.id];
        delete user.password;
      }
      return { thisWeekEntries, prevWeekEntries, users };
    } catch (e) {
      return new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }
}
