import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  Post,
} from '@nestjs/common';
import { signInSchema } from '../../schemas/user.schema';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @HttpCode(200)
  @Post('/signin')
  async signIn(@Body() body: { email: string; password: string }) {
    const { value, error } = await signInSchema.validate(body);
    if (error) throw new HttpException(error.message, 400);
    return await this.userService.signIn(value);
  }
}
