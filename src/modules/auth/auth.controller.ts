import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Request } from 'express';

import { JwtRefreshAuthGuard } from '@/common/guards';
import { CookieInterceptor } from '@/common/interceptors';
import type { User } from '@/database/schema';

import { AuthService } from './auth.service';
import type { AuthSuccessResponseDto } from './dto';
import { AuthConfirmEmailDto, AuthEmailLoginDto, AuthRegisterDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Throttle({ default: { limit: 7, ttl: 300000 } }) // 3 req in 5 mint
  @Post('email/register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: AuthRegisterDto): Promise<{ message: string }> {
    return await this.service.register(registerDto);
  }

  @UseInterceptors(CookieInterceptor)
  @Post('email/confirm')
  @HttpCode(HttpStatus.OK)
  async confirmEmail(@Body() confirmEmailDto: AuthConfirmEmailDto): Promise<AuthSuccessResponseDto> {
    return await this.service.confirmEmail(confirmEmailDto.token);
  }

  @Throttle({ default: { limit: 10, ttl: 120000 } }) // 10 req in 2 mint
  @UseInterceptors(CookieInterceptor)
  @Post('email/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: AuthEmailLoginDto): Promise<AuthSuccessResponseDto> {
    return await this.service.login(loginDto);
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Get('refresh')
  @HttpCode(HttpStatus.OK)
  public refreshTokens(@Req() req: Request) {
    const user = req.user as User;
    return this.service.refreshToken(user.id);
  }
}
