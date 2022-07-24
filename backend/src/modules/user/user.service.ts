import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../../entities/user.entity';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserService {
  async signIn({ email, password }: { email: string; password: string }) {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new NotFoundException('Invalid credentials');
    if (!bcrypt.compareSync(password, user.password))
      throw new NotFoundException('Invalid credentials');

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY);
    return {
      ...user,
      token,
      password: undefined,
    };
  }

  async findById(id: number): Promise<User> {
    return await User.findOne({ where: { id } });
  }
}
