import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums/role.enum';
import { ROLES_KEY } from '../utils/roles.decorator';

import { config } from 'dotenv';
import { UserService } from '../modules/user/user.service';
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
      return true;
    } catch (e) {
      throw new UnauthorizedException(e.message);
    }
  }
}