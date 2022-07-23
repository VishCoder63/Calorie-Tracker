import { NestFactory } from '@nestjs/core';
import { AppModule } from '../backend/src/app.module';
import { Food } from '../backend/src/entities/food.entity';
import { User } from '../backend/src/entities/user.entity';
import * as Bcryptjs from 'bcryptjs';
import { faker } from '@faker-js/faker';
import * as _ from 'lodash';
import { Role } from './src/enums/role.enum';
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
  //   const role = ['user', 'admin'];

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
  const today = new Date(Date.now());
  const from = today.getDate() - Math.ceil(Math.random() * 20);
  const foods = [];
  for (let i = 0; i < 20; i++) {
    const food = new Food();

    food.name = _.sample([
      'Burger',
      'Banana',
      'Rice',
      'Apple',
      'Pizza',
      'Pazta',
      'Roti',
    ]);
    food.date = faker.date.between(from, today);
    food.month = food.date.getMonth();
    food.calorie = faker.datatype.number({ min: 0.1, max: 5 });
    food.price = faker.datatype.number({ min: 0.01, max: 1 });
    food.userId = faker.datatype.number({ min: 1, max: 2 });
    foods.push(food);
  }

  await Food.save(foods);
};

bootstrap().then();
