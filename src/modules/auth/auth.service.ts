import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { plainToClass } from 'class-transformer';

import { env } from '@/common/config';
import { BadRequestError, ConflictError, ForbiddenError, NotFoundError } from '@/common/error';
import { AuthProviders, Role, Status, TokenType } from '@/common/types';
import type { JwtTokens } from '@/common/types/jwt.tokens';
import type { User } from '@/database/schema';
import { MailService } from '@/modules/mail/mail.service';
import { TokensService } from '@/modules/tokens/tokens.service';
import { UsersService } from '@/modules/users/users.service';

import type { AuthSuccessResponseDto } from './dto';
import type { OAuthValidateDto } from './dto';
import { type AuthEmailLoginDto, type AuthRegisterDto, UserResponse } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
    private readonly tokenService: TokensService
  ) {}

  async validateOAuthUser(oauthUser: OAuthValidateDto): Promise<User> {
    let user = await this.usersService.findByEmail(oauthUser.email);

    if (!user) {
      user = await this.usersService.createOauthUser({
        ...oauthUser,
        status: Status.ACTIVE,
        providers: [oauthUser.providers],
      });
    } else {
      let allUserProviders = user.providers;

      if (user.status === Status.INACTIVE) {
        allUserProviders = allUserProviders.filter((p) => p.provider !== AuthProviders.EMAIL);
      }

      const existingProvider = allUserProviders.find((p) => p.providerId === oauthUser.providers.providerId);

      if (!existingProvider) {
        allUserProviders.push(oauthUser.providers);
        user = await this.usersService.update(user.id, {
          providers: allUserProviders,
          imageUrl: oauthUser.imageUrl,
          status: Status.ACTIVE,
        });
      }
    }
    return user;
  }

  async register(registerDto: AuthRegisterDto): Promise<{ message: string }> {
    const existingUser = await this.usersService.findByEmail(registerDto.email);

    if (existingUser) {
      return this.handleExistingUser(existingUser);
    }

    const user = await this.usersService.create({
      ...registerDto,
      role: Role.USER,
      status: Status.INACTIVE,
      providers: [{ provider: AuthProviders.EMAIL, providerId: null }],
    });

    const expiresIn = env.AUTH_CONFIRM_EMAIL_TOKEN_EXPIRES_IN;

    const token = await this.generateEmailVerificationToken(user.id);
    await this.tokenService.storeToken(token, user.id, TokenType.EmailVerification, expiresIn);
    await this.sendVerificationEmail(user.email, token);

    return { message: 'Registration successful. Please check your email for verification.' };
  }

  private async handleExistingUser(existingUser: User): Promise<{ message: string }> {
    if (existingUser.status === Status.INACTIVE) {
      const token = await this.generateEmailVerificationToken(existingUser.id);

      const expiresIn = env.AUTH_CONFIRM_EMAIL_TOKEN_EXPIRES_IN;

      await this.tokenService.deleteOldToken(TokenType.EmailVerification, existingUser.id);
      await this.tokenService.storeToken(token, existingUser.id, TokenType.EmailVerification, expiresIn);

      await this.sendVerificationEmail(existingUser.email, token);
      return { message: 'Email already registered but not verified. Verification email resent.' };
    }

    throw new ConflictError('Email is already in use.');
  }

  async confirmEmail(token: string): Promise<AuthSuccessResponseDto> {
    const isTokenExist = await this.tokenService.findToken(token);

    if (!isTokenExist) throw new BadRequestError('Invalid token or token does not exist');

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

    await this.tokenService.deleteToken(token);

    const { accessToken, refreshToken } = await this.generateToken(user.id, user.role);

    const expiresIn = env.AUTH_REFRESH_TOKEN_EXPIRES_IN;
    await this.tokenService.storeToken(refreshToken, user.id, TokenType.RefreshToken, expiresIn);

    const userSerialized = plainToClass(UserResponse, updatedUser);

    return { accessToken, refreshToken, user: userSerialized };
  }

  async login(loginDto: AuthEmailLoginDto, cookieToken: string | null): Promise<AuthSuccessResponseDto> {
    if (cookieToken) await this.tokenService.deleteToken(cookieToken);

    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) throw new BadRequestError('Incorrect credentials. Please try again');

    if (user.status === Status.INACTIVE) throw new BadRequestError('email not verified! Please register again!');

    const hasEmailProvider = user.providers.some((p) => p.provider === AuthProviders.EMAIL);
    if (!hasEmailProvider && user.providers.length > 0) {
      throw new BadRequestError(
        'You have registered using another method. Please log in using the same method you used for registration.'
      );
    }

    const isValidPassword = await argon2.verify(user.password, loginDto.password);

    if (!isValidPassword) throw new BadRequestError('Incorrect credentials. Please try again');

    const { accessToken, refreshToken } = await this.generateToken(user.id, user.role);

    const expiresIn = env.AUTH_REFRESH_TOKEN_EXPIRES_IN;
    await this.tokenService.storeToken(refreshToken, user.id, TokenType.RefreshToken, expiresIn);

    const userSerialized = plainToClass(UserResponse, user);

    return { accessToken, refreshToken, user: userSerialized };
  }

  async oAuthLogin(user: User): Promise<AuthSuccessResponseDto> {
    const { accessToken, refreshToken } = await this.generateToken(user.id, user.role);

    const expiresIn = env.AUTH_REFRESH_TOKEN_EXPIRES_IN;
    await this.tokenService.storeToken(refreshToken, user.id, TokenType.RefreshToken, expiresIn);

    const userSerialized = plainToClass(UserResponse, user);

    return { accessToken, refreshToken, user: userSerialized };
  }

  async logout(rToken: string): Promise<void> {
    if (!rToken) return;
    await this.tokenService.deleteToken(rToken);
  }

  async refreshToken(rToken: string, user: Partial<User>) {
    const isTokenExist = await this.tokenService.findToken(rToken);

    if (!isTokenExist) {
      throw new ForbiddenError();
    }

    await this.tokenService.deleteToken(rToken);

    const { accessToken, refreshToken } = await this.generateToken(user.id, user.role);

    const expiresIn = env.AUTH_REFRESH_TOKEN_EXPIRES_IN;
    await this.tokenService.storeToken(refreshToken, user.id, TokenType.RefreshToken, expiresIn);

    return { accessToken, refreshToken };
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
