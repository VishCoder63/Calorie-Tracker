import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../../guards/auth.guard';
import {
  createFoodSchema,
  getFoodSchema,
  updateFoodSchema,
} from '../../schemas/food.schema';
import { Auth, IAuth } from '../../utils/auth.decorator';
import { FoodService } from './food.service';

@Controller('foods')
export class FoodController {
  constructor(private readonly foodservice: FoodService) {}

  @UseGuards(AuthGuard)
  @HttpCode(201)
  @Post('/')
  async createFood(@Body() body, @Auth() auth: IAuth) {
    const { value, error } = await createFoodSchema.validate(body);
    if (error) throw new HttpException(error.message, 400);
    return this.foodservice.createFood(value, auth);
  }
  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Get()
  async getFoods(@Query() queryParams: any, @Auth() auth: IAuth) {
    const { value, error } = await getFoodSchema.validate(queryParams);
    if (error) throw new HttpException(error.message, 400);
    return this.foodservice.getFoods(value, auth);
  }
  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Patch(':id')
  async updateFood(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any,
    @Auth() auth: IAuth,
  ) {
    const { value, error } = await updateFoodSchema.validate(body);
    if (error) throw new HttpException(error.message, 400);
    return this.foodservice.updateFood(id, value, auth);
  }

  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Delete(':id')
  deleteFood(@Param('id') id: string, @Auth() auth: IAuth) {
    return this.foodservice.deleteFood(+id, auth);
  }
}
