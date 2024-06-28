import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { plainToClass } from 'class-transformer';

import { env } from '@/common/config';
import { BadRequestError, ConflictError, NotFoundError } from '@/common/error';
import { AuthProviders, Role, Status, TokenType } from '@/common/types';
import type { JwtTokens } from '@/common/types/jwt.tokens';
import type { User } from '@/database/schema';
import { MailService } from '@/modules/mail/mail.service';
import { TokensService } from '@/modules/tokens/tokens.service';
import { UsersService } from '@/modules/users/users.service';

import type { AuthSuccessResponseDto } from './dto';
import { type AuthEmailLoginDto, type AuthRegisterDto, UserResponse } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
    private readonly tokenService: TokensService
  ) {}

  async register(registerDto: AuthRegisterDto): Promise<{ message: string }> {
    const existingUser = await this.usersService.findByEmail(registerDto.email);

    if (existingUser) {
      return this.handleExistingUser(existingUser);
    }

    const user = await this.usersService.create({
      ...registerDto,
      role: Role.USER,
      status: Status.INACTIVE,
      provider: AuthProviders.email,
    });

    const token = await this.generateEmailVerificationToken(user.id);
    await this.tokenService.storeEmailToken(token, user.id);
    await this.sendVerificationEmail(user.email, token);

    return { message: 'Registration successful. Please check your email for verification.' };
  }

  private async handleExistingUser(existingUser: User): Promise<{ message: string }> {
    if (existingUser.status === Status.INACTIVE) {
      const token = await this.generateEmailVerificationToken(existingUser.id);

      await this.tokenService.revokeToken(TokenType.EmailVerification, existingUser.id);
      await this.tokenService.storeEmailToken(token, existingUser.id);

      await this.sendVerificationEmail(existingUser.email, token);
      return { message: 'Email already registered but not verified. Verification email resent.' };
    }
    throw new ConflictError('Email is already in use.');
  }

  async confirmEmail(token: string): Promise<AuthSuccessResponseDto> {
    const isTokenRevoked = await this.tokenService.isTokenRevoked(token);

    if (isTokenRevoked) throw new BadRequestError('Invalid token or token does not exist');

    const jwtData = await this.jwtService.verifyAsync<{
      confirmEmailUserId: number;
    }>(token, {
      secret: env.AUTH_CONFIRM_EMAIL_SECRET,
    });

    const userId = jwtData.confirmEmailUserId;

    const user = await this.usersService.findById(userId);

    if (!user) throw new NotFoundError('user not found!');
    if (user.status !== Status.INACTIVE) throw new NotFoundError('email already verified!');

    const clonedUser = { ...user, status: Status.ACTIVE };

    const updatedUser = await this.usersService.update(user.id, clonedUser);

    // revoke token
    await this.tokenService.revokeToken(TokenType.EmailVerification, user.id);

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

  async refreshToken(user: number) {
    console.warn(user);
  }

  private async generateEmailVerificationToken(userId: number): Promise<string> {
    return this.jwtService.signAsync(
      { confirmEmailUserId: userId },
      {
        secret: env.AUTH_CONFIRM_EMAIL_SECRET,
        expiresIn: env.AUTH_CONFIRM_EMAIL_TOKEN_EXPIRES_IN,
      }
    );
  }

  private async sendVerificationEmail(email: string, token: string): Promise<void> {
    await this.mailService.confirmNewEmail({
      to: email,
      data: { token },
    });
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
