import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Role } from '../../enums/role.enum';
import { Roles } from '../../utils/roles.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import {
  createFoodSchema,
  getFoodSchema,
  updateFoodSchema,
} from '../../schemas/food.schema';
import { Auth, IAuth } from '../../utils/auth.decorator';
import { FoodService } from '../food/food.service';

@Controller('foods')
export class FoodController {
  constructor(private readonly foodservice: FoodService) {}

  @UseGuards(AuthGuard)
  @Post('/')
  async createFood(@Body() body, @Auth() auth: IAuth) {
    const { value, error } = createFoodSchema.validate(body);
    if (error) throw new HttpException(error.message, 400);
    return this.foodservice.createFood(value, auth);
  }

  @UseGuards(AuthGuard)
  @Get()
  async getFoods(@Query() queryParams: any, @Auth() auth: IAuth) {
    const { value, error } = getFoodSchema.validate(queryParams);
    if (error) throw new HttpException(error.message, 400);
    return this.foodservice.getFoods(value, auth);
  }

  @Roles(Role.Admin)
  @UseGuards(AuthGuard)
  @Put(':id')
  async updateFood(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    const { value, error } = updateFoodSchema.validate(body);
    if (error) throw new HttpException(error.message, 400);
    return this.foodservice.updateFood(id, value);
  }

  @Roles(Role.Admin)
  @UseGuards(AuthGuard)
  @Delete(':id')
  deleteFood(@Param('id') id: string) {
    console.log('called');
    return this.foodservice.deleteFood(+id);
  }

  @Roles(Role.Admin)
  @UseGuards(AuthGuard)
  @Get('stats')
  getStats() {
    return this.foodservice.getStats();
  }
}
