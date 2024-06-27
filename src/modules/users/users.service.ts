import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

import { ConflictError } from '@/common/error';
import { AuthProviders } from '@/common/types';
import type { User } from '@/database/schema';

import type { CreateUserDto } from './dto/create-user.dto';
import type { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './repository/users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(user: CreateUserDto): Promise<User> {
    if (!user.provider) user.provider = AuthProviders.email;

    const isUserExist = await this.usersRepository.findByEmail(user.email);

    if (isUserExist) throw new ConflictError('email already registered!');

    user.password = await argon2.hash(user.password);

    return await this.usersRepository.create(user);
  }

  async findById(userId: number): Promise<User> {
    return await this.usersRepository.findById(userId);
  }

  async update(userId: number, user: UpdateUserDto): Promise<User> {
    return await this.usersRepository.update(userId, user);
  }
}
