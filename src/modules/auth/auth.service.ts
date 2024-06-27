import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { env } from '@/common/config';
import { AuthProviders, Role, Status } from '@/common/types';
import { UsersService } from '@/modules/users/users.service';

import type { AuthRegisterDto } from './dto/auth-register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService
  ) {}

  async register(registerDto: AuthRegisterDto): Promise<{ message: string }> {
    const user = await this.usersService.create({
      ...registerDto,
      role: Role.USER,
      status: Status.INACTIVE,
      provider: AuthProviders.email,
    });

    const hash = await this.jwtService.signAsync(
      {
        confirmEmailUserId: user.id,
      },
      {
        secret: env.AUTH_CONFIRM_EMAIL_SECRET,
        expiresIn: env.AUTH_CONFIRM_EMAIL_TOKEN_EXPIRES_IN,
      }
    );

    //TODO: SEND EMAIL
    console.warn(hash);

    return { message: 'Registration successful. Please check your email for verification.' };
  }
}
