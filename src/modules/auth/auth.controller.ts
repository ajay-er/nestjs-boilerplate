import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Request, Response } from 'express';

import { JwtRefreshAuthGuard } from '@/common/guards';
import { CookieInterceptor } from '@/common/interceptors';
import { TokenType } from '@/common/types';
import type { User } from '@/database/schema';

import { AuthService } from './auth.service';
import type { AuthSuccessResponseDto } from './dto';
import { AuthConfirmEmailDto, AuthEmailLoginDto, AuthRegisterDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Throttle({ default: { limit: 7, ttl: 300000 } }) // 7 req in 5 mint
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
  async login(
    @Body() loginDto: AuthEmailLoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<AuthSuccessResponseDto> {
    const cookieToken = req.cookies[TokenType.RefreshToken];
    const result = await this.service.login(loginDto, cookieToken);
    res.clearCookie(TokenType.RefreshToken, { httpOnly: true, sameSite: 'none', secure: true });
    return result;
  }

  @UseGuards(JwtRefreshAuthGuard)
  @UseInterceptors(CookieInterceptor)
  @Get('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<Omit<AuthSuccessResponseDto, 'user'>> {
    const user = req.user as User;
    const rToken = req.cookies[TokenType.RefreshToken];

    res.clearCookie(TokenType.RefreshToken, { httpOnly: true, sameSite: 'none', secure: true });

    const { accessToken, refreshToken } = await this.service.refreshToken(rToken, user);

    return { accessToken, refreshToken };
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<void> {
    const rToken = req.cookies[TokenType.RefreshToken];
    await this.service.logout(rToken);
    res.clearCookie(TokenType.RefreshToken, { httpOnly: true, sameSite: 'none', secure: true });
  }
}
