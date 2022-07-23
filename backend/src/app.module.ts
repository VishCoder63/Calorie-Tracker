import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Food } from '../src/entities/food.entity';
import { User } from '../src/entities/user.entity';
import { FoodModule } from '../src/modules/food/food.module';
import { UserModule } from '../src/modules/login/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [User, Food],
      synchronize: true,
    }),
    UserModule,
    FoodModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
