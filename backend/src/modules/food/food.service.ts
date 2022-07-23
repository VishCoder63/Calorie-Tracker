import { BadRequestException, Injectable } from '@nestjs/common';
import { Food } from '../../entities/food.entity';
import { IAuth } from '../../utils/auth.decorator';
import { Between } from 'typeorm';

@Injectable()
export class FoodService {
  getAllFoods({ startDate, endDate, page }, auth: IAuth) {
    const limit = 5;
    if (startDate > endDate)
      throw new BadRequestException('start date must be less than end date...');
    const userRole = {};
    if (auth.role === 'user') userRole['userId'] = auth.id;
    if (!startDate && !endDate) {
      return Food.find({
        where: { ...userRole },
        take: limit,
        skip: (page - 1) * limit,
      });
    } else
      return Food.find({
        where: { date: Between(startDate, endDate), ...userRole },
        take: limit,
        skip: (page - 1) * limit,
      });
  }

  async dbUpdate(body, operation) {
    const { calorie, price, date, userId, month } = body;
    const prevFoodEnteries = await Food.find({
      where: {
        userId,
        date: new Date(date),
      },
    });

    prevFoodEnteries.map((entry) => {
      operation == 'add'
        ? (entry.dailyTotalCalorie += calorie)
        : (entry.dailyTotalCalorie -= calorie);
    });

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

    await Food.save(prevBudgetEnteries);
    return { prevBudgetEnteries, prevFoodEnteries };
  }

  async createFood(body, auth: IAuth) {
    const { prevBudgetEnteries, prevFoodEnteries } = await this.dbUpdate(
      body,
      'add',
    );
    console.log(prevBudgetEnteries, prevFoodEnteries);
    const { name, calorie, price, date, month } = body;

    const food = new Food();
    food.name = name;
    food.date = date;
    food.month = month;
    food.calorie = calorie;
    food.price = price;
    food.userId = auth.id;
    food.dailyTotalCalorie = prevFoodEnteries[0]
      ? prevFoodEnteries[0].dailyTotalCalorie
      : calorie;
    food.monthlyTotalAmount = prevBudgetEnteries[0]
      ? prevBudgetEnteries[0].monthlyTotalAmount
      : price;
    return food.save();
  }
  async updateFood(id: number, body) {
    const food = await Food.findOne({ where: { id } });
    if (!food) throw new BadRequestException();
    await this.dbUpdate(food, 'delete');
    await this.dbUpdate(body, 'add');
    await Food.update(id, body);
  }
  async deleteFood(id: number) {
    const foodItem = await Food.findOne({ where: { id } });
    if (!foodItem) throw new BadRequestException();
    await this.dbUpdate(foodItem, 'delete');
    return Food.delete(id);
  }
}
