import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../../entities/user.entity';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { faker } from '@faker-js/faker';
import { Role } from '../../enums/role.enum';

@Injectable()
export class UserService {
  async signIn({ email, password }: { email: string; password: string }) {
    const user = await User.findOne({
      where: { email: email.toLowerCase() },
      select: ['password', 'id', 'email', 'role', 'name'],
    });
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
    return await User.findOne({
      where: { id },
    });
  }

  async inviteFriend({ email, name }: { email: string; name: string }) {
    try {
      const isUserInDb = await User.findOne({
        where: { email: email.toLowerCase() },
      });
      if (isUserInDb) throw new Error('Already registered!! Please login');
      const newUser = new User();
      const randWord = faker.lorem.word(6);
      const password = bcrypt.hashSync(randWord, 10);
      newUser.email = email.toLowerCase();
      newUser.password = password;
      newUser.name = name;
      newUser.role = Role.User;
      await User.save(newUser);

      return { user: { ...newUser, password: randWord } };
    } catch (e) {
      throw new HttpException(e.message, 400);
    }
  }
}
