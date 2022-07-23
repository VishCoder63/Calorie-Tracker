import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Role } from 'src/enums/role.enum';

export interface IAuth {
  id: number;
  name: string;
  email: string;
  role: Role;
}

export const Auth = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
