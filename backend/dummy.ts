import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { Food } from './src/entities/food.entity';
import { User } from './src/entities/user.entity';
import * as Bcryptjs from 'bcryptjs';
import { faker } from '@faker-js/faker';
import * as _ from 'lodash';
import { Role } from './src/enums/role.enum';
import * as moment from 'moment';
import { FoodService } from '../backend/src/modules/food/food.service';

const bootstrap = async () => {
  const app = await NestFactory.createApplicationContext(AppModule);
  await User.delete({});
  await Food.delete({});
  await seedUsers();
  await seedFoods();
  await app.close();
};

const seedUsers = async () => {
  const users = [];

  for (let i = 0; i < 2; i++) {
    const u = new User();
    u.name = faker.name.findName();
    u.password = Bcryptjs.hashSync('1234', 10);
    u.role = i % 3 == 0 ? Role.Admin : Role.User;
    u.email = faker.internet.email();
    users.push(u);
  }

  await User.save(users);
};

const seedFoods = async () => {
  const foodServiceObj = new FoodService();
  const today = new Date(Date.now());

  const users = await User.find();
  const idArray = users.map((user) => user.id);
  for (let i = 0; i < 5; i++) {
    const food = new Food();
    const from = today.setDate(today.getDate() - Math.random() * 5);

    food.name = _.sample([
      'Burger',
      'Banana',
      'Rice',
      'Apple',
      'Pizza',
      'Pasta',
      'Roti',
    ]);
    food.date = moment(faker.date.between(from, today)).format('YYYY-MM-DD');
    food.month = moment(food.date).format('YYYY-MM');
    food.time = moment(food.date).format('HH:mm');
    food.calorie = faker.datatype.number({ min: 1, max: 2, precision: 1 });
    food.price = faker.datatype.number({ min: 1, max: 2, precision: 1 });
    //limiting the user id to 1 and 2
    food.userId = _.sample(idArray);

    food.dailyTotalCalorie = 0;
    food.monthlyTotalAmount = 0;

    await Food.save(food);
    const { prevBudgetEnteries, prevFoodEnteries } =
      await foodServiceObj.dbUpdate(food, 'add');
    food.dailyTotalCalorie = prevFoodEnteries[0]
      ? prevFoodEnteries[0].dailyTotalCalorie
      : food.calorie;
    food.monthlyTotalAmount = prevBudgetEnteries[0]
      ? prevBudgetEnteries[0].monthlyTotalAmount
      : food.price;
  }
};

bootstrap().then();
