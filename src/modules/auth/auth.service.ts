import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { plainToClass } from 'class-transformer';

import { env } from '@/common/config';
import { BadRequestError, NotFoundError } from '@/common/error';
import { AuthProviders, Role, Status } from '@/common/types';
import type { JwtTokens } from '@/common/types/jwt.tokens';
import { MailService } from '@/modules/mail/mail.service';
import { UsersService } from '@/modules/users/users.service';

import type { AuthSuccessResponseDto } from './dto';
import { type AuthEmailLoginDto, type AuthRegisterDto, UserResponse } from './dto';

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

  async confirmEmail(token: string): Promise<AuthSuccessResponseDto> {
    const jwtData = await this.jwtService.verifyAsync<{
      confirmEmailUserId: number;
    }>(token, {
      secret: env.AUTH_CONFIRM_EMAIL_SECRET,
    });
    const userId = jwtData.confirmEmailUserId;

    const user = await this.usersService.findById(userId);

    if (!user || user.status !== Status.INACTIVE) throw new NotFoundError('user not found!');

    const clonedUser = { ...user, status: Status.ACTIVE };

    const updatedUser = await this.usersService.update(user.id, clonedUser);

    const { accessToken, refreshToken } = await this.generateToken(user.id, user.role);

    const userSerialized = plainToClass(UserResponse, updatedUser);

    return { refreshToken, accessToken, user: userSerialized };
  }

  async login(loginDto: AuthEmailLoginDto): Promise<AuthSuccessResponseDto> {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) throw new BadRequestError('Incorrect credentials. Please try again');

    if (user.provider !== AuthProviders.email)
      throw new BadRequestError('Login with email credentials is required for this account');

    const isValidPassword = await argon2.verify(user.password, loginDto.password);

    if (!isValidPassword) throw new BadRequestError('Incorrect credentials. Please try again');

    const { accessToken, refreshToken } = await this.generateToken(user.id, user.role);

    const userSerialized = plainToClass(UserResponse, user);

    return { refreshToken, accessToken, user: userSerialized };
  }

  async generateToken(userId: number, role: string): Promise<JwtTokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          id: userId,
          role,
        },
        { secret: env.AUTH_JWT_SECRET, expiresIn: env.AUTH_JWT_TOKEN_EXPIRES_IN }
      ),
      this.jwtService.signAsync(
        {
          id: userId,
          role,
        },
        { secret: env.AUTH_REFRESH_SECRET, expiresIn: env.AUTH_REFRESH_TOKEN_EXPIRES_IN }
      ),
    ]);
    return { accessToken, refreshToken };
  }
}
