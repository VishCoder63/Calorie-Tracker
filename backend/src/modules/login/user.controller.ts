import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  Post,
} from '@nestjs/common';
import { signinSchema } from '../../schemas/user.schema';
import { UserService } from '../login/user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @HttpCode(200)
  @Post('/signin')
  async signin(@Body() body: { email: string; password: string }) {
    const { value, error } = await signinSchema.validate(body);
    if (error) throw new HttpException(error.message, 400);
    return await this.userService.signin(value);
  }
}
