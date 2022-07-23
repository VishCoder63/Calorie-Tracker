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
import { Role } from '../../enums/role.enum';
import { AuthGuard } from '../../guards/auth.guard';
import {
  createFoodSchema,
  getFoodSchema,
  updateFoodSchema,
} from '../../schemas/food.schema';
import { Auth, IAuth } from '../../utils/auth.decorator';
import { Roles } from '../../utils/roles.decorator';
import { FoodService } from '../food/food.service';

@Controller('foods')
export class FoodController {
  constructor(private readonly foodservice: FoodService) {}

  @Roles(Role.User, Role.Admin)
  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Post('/')
  async createFood(@Body() body, @Auth() auth: IAuth) {
    const { value, error } = await createFoodSchema.validate(body);
    if (error) throw new HttpException(error.message, 400);
    return this.foodservice.createFood(value, auth);
  }

  @Roles(Role.User, Role.Admin)
  @UseGuards(AuthGuard)
  @Get()
  async getAllFoods(@Query() queryParams: any, @Auth() auth: IAuth) {
    const { value, error } = await getFoodSchema.validate(queryParams);
    if (error) throw new HttpException(error.message, 400);
    return this.foodservice.getAllFoods(value, auth);
  }

  @Roles(Role.Admin)
  @UseGuards(AuthGuard)
  @Patch(':id')
  async updateFood(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    const { value, error } = await updateFoodSchema.validate(body);
    if (error) throw new HttpException(error.message, 400);
    return this.foodservice.updateFood(id, value);
  }

  @Roles(Role.Admin)
  @UseGuards(AuthGuard)
  @Delete(':id')
  deleteFood(@Param('id') id: string) {
    return this.foodservice.deleteFood(+id);
  }
}
