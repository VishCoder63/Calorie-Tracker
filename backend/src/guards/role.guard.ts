import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Reflector } from '@nestjs/core';

import { config } from 'dotenv';
import { UserService } from '../modules/user/user.service';
import { Role } from 'src/enums/role.enum';
config();

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector, private userService: UserService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    try {
      const token = request.headers?.jwt;

      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      if (!decoded) throw new UnauthorizedException();
      const user = await this.userService.findById(decoded.id);
      if (!user) {
        throw new UnauthorizedException();
      }
      request.user = user;
      return user.role === Role.Admin;
    } catch (e) {
      throw new UnauthorizedException(e.message);
    }
  }
}
