import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../../entities/user.entity';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserService {
  async signin({ email, password }: { email: string; password: string }) {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new NotFoundException('Invalid credentials');
    if (!(await bcrypt.compare(password, user.password)))
      throw new NotFoundException('Invalid credentials');

    const token = jwt.sign({ id: user.id }, 'hello');
    return {
      ...user.toJSON(),
      token,
    };
  }

  async findById(id: number): Promise<User> {
    return await User.findOne({ where: { id } });
  }
}
