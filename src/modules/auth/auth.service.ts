import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { env } from '@/common/config';
import { NotFoundError } from '@/common/error';
import { AuthProviders, Role, Status } from '@/common/types';
import type { User } from '@/database/schema';
import { MailService } from '@/modules/mail/mail.service';
import { UsersService } from '@/modules/users/users.service';

import type { AuthRegisterDto } from './dto/auth-register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly mailService: MailService
  ) {}

  async register(registerDto: AuthRegisterDto): Promise<{ message: string }> {
    const user = await this.usersService.create({
      ...registerDto,
      role: Role.USER,
      status: Status.INACTIVE,
      provider: AuthProviders.email,
    });

    const token = await this.jwtService.signAsync(
      {
        confirmEmailUserId: user.id,
      },
      {
        secret: env.AUTH_CONFIRM_EMAIL_SECRET,
        expiresIn: env.AUTH_CONFIRM_EMAIL_TOKEN_EXPIRES_IN,
      }
    );

    // TODO: BLOCKING --> NON BLOCKING:- USING QUEUE
    await this.mailService.confirmNewEmail({
      to: user.email,
      data: {
        token: token,
      },
    });

    return { message: 'Registration successful. Please check your email for verification.' };
  }

  async confirmEmail(token: string): Promise<User> {
    const jwtData = await this.jwtService.verifyAsync<{
      confirmEmailUserId: number;
    }>(token, {
      secret: env.AUTH_CONFIRM_EMAIL_SECRET,
    });
    const userId = jwtData.confirmEmailUserId;

    const user = await this.usersService.findById(userId);

    if (!user || user.status !== Status.INACTIVE) throw new NotFoundError('user not found!');

    const clonedUser = { ...user, status: Status.ACTIVE };

    return await this.usersService.update(user.id, clonedUser);
  }
}
