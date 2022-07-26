import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { inviteFriendSchema, signInSchema } from '../../schemas/user.schema';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/signin')
  async signIn(@Body() body: { email: string; password: string }) {
    const { value, error } = signInSchema.validate(body);

    if (error) throw new HttpException(error.message, 400);
    return await this.userService.signIn(value);
  }
  @Post('/invite')
  async inviteFriend(@Body() body: { email: string; name: string }) {
    const { value, error } = inviteFriendSchema.validate(body);

    if (error) throw new HttpException(error.message, 400);
    return await this.userService.inviteFriend(value);
  }
}
