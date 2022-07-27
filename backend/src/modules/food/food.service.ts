import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
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
  private static async validateFoodId(id: number) {
    const foodItem = await Food.findOne({ where: { id } });
    if (!foodItem) {
      throw new BadRequestException('Food entry not found!');
    }
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
    const whereClause: any = {};

    if (auth.role === Role.User) whereClause.userId = auth.id;

    if (startDate || endDate) {
      const startDateMoment = moment(startDate).format('YYYY-MM-DD');
      const endDateMoment = moment(endDate).format('YYYY-MM-DD');
      whereClause.date = Between(startDateMoment, endDateMoment);
      console.log(startDateMoment, endDateMoment);
    }

    const results = await Food.find({
      where: whereClause,
      take: limit,
      skip: (page - 1) * limit,
      relations: { user: true },
    });
    const count = await Food.count({
      where: whereClause,
    });
    return {
      results,
      count,
      limit,
    };
  }

  async createFood(body, auth: IAuth) {
    try {
      let foodUserId = auth.id;
      const food = new Food();
      const { name, calorie, price, datetime, email } = body;
      if (email) {
        if (auth.role === Role.Admin) {
          const user = await User.findOne({
            where: { email: email.toLowerCase() },
          });
          if (!user)
            throw new NotFoundException('User not found with existing email');
          foodUserId = user.id;
        } else {
          throw new HttpException('Only Admin can create food by email', 400);
        }
      }
      food.name = name;
      food.date = moment(datetime).format('YYYY-MM-DD');
      food.month = moment(datetime).format('YYYY-MM');
      food.time = moment(datetime).format('HH:mm');
      food.calorie = calorie;
      food.price = price;
      food.userId = foodUserId;
      await food.save();
      await this.updateDbAfterOperation(food.userId, food.date);
      return {
        response: { data: food, message: 'Food entry successfully made!' },
      };
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
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
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async deleteFood(id: number) {
    try {
      const foodItem = await FoodService.validateFoodId(id);
      await Food.delete(id);
      await this.updateDbAfterOperation(foodItem.userId, foodItem.date);
      return {
        response: { data: { message: 'Deleted successfully!' } },
      };
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async updateFood(id: number, body) {
    const food = await FoodService.validateFoodId(id);

    const prevUserId = food.userId;
    const prevDate = food.date;

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

      await Food.update(id, body);
      // console.log(prevUserId, prevDate, body.userId, body.date);
      await this.updateDbAfterOperation(prevUserId, prevDate);
      await this.updateDbAfterOperation(body.userId, body.date);
      return { response: { data: { message: 'Updated successfully!' } } };
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
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
      return {
        response: { data: { thisWeekEntries, prevWeekEntries, users } },
      };
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }
}
