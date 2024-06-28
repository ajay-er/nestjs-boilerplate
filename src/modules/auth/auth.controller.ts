import { Body, Controller, HttpCode, HttpStatus, Post, UseInterceptors } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

import { ExcludeFieldsInterceptor } from '@/common/interceptors';

import { AuthService } from './auth.service';
import type { AuthSuccessResponseDto } from './dto';
import { AuthConfirmEmailDto, AuthEmailLoginDto, AuthRegisterDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Throttle({ default: { limit: 3, ttl: 300000 } }) // 3 req in 5 mint
  @Post('email/register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: AuthRegisterDto): Promise<{ message: string }> {
    return await this.service.register(registerDto);
  }

  @Post('email/confirm')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ExcludeFieldsInterceptor)
  async confirmEmail(@Body() confirmEmailDto: AuthConfirmEmailDto): Promise<AuthSuccessResponseDto> {
    return await this.service.confirmEmail(confirmEmailDto.token);
  }

  @Throttle({ default: { limit: 10, ttl: 120000 } }) // 10 req in 2 mint
  @Post('email/login')
  @HttpCode(HttpStatus.OK)
  public login(@Body() loginDto: AuthEmailLoginDto): Promise<AuthSuccessResponseDto> {
    return this.service.login(loginDto);
  }
}
