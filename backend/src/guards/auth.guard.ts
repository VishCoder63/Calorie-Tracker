import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums/role.enum';
import { ROLES_KEY } from '../utils/roles.decorator';
import * as jwt from 'jsonwebtoken';
import { UserService } from '../modules/user/user.service';
import { config } from 'dotenv';
config();
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector, private userService: UserService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const token = request.headers?.jwt;
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      if (!decoded) throw new UnauthorizedException();
      const user = await this.userService.findById(decoded.id);
      if (!user) {
        throw new UnauthorizedException();
      }
      request.user = user;
      const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );
      if (!requiredRoles) {
        return true;
      }
      return requiredRoles.includes(user.role);
    } catch (e) {
      throw new UnauthorizedException(e.message);
    }
  }
}
