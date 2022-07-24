import { Module } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { FoodController } from './food.controller';
import { FoodService } from './food.service';

@Module({
  controllers: [FoodController],
  providers: [FoodService, UserService],
})
export class FoodModule {}
