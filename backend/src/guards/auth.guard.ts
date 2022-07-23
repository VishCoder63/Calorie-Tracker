import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums/role.enum';
import { ROLES_KEY } from '../utils/roles.decorator';

import { config } from 'dotenv';
import { UserService } from '../modules/login/user.service';
config();

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector, private userService: UserService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();
    const token = request.headers.Authorization;
    const decoded = jwt.verify(token, 'hello');
    if (!decoded) throw new UnauthorizedException();
    const user = await this.userService.findById(decoded.id);
    if (!user) {
      throw new UnauthorizedException();
    }
    request.user = user;
    return requiredRoles && requiredRoles.includes(user.role);
  }
}
