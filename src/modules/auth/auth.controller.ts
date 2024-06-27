import { Body, Controller, HttpCode, HttpStatus, Post, UseInterceptors } from '@nestjs/common';

import { ExcludeFieldsInterceptor } from '@/common/interceptors';

import { AuthService } from './auth.service';
import type { AuthConfirmResponse, LoginResponseDto } from './dto';
import { AuthConfirmEmailDto, AuthEmailLoginDto, AuthRegisterDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('email/register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: AuthRegisterDto): Promise<{ message: string }> {
    return await this.service.register(registerDto);
  }

  @Post('email/confirm')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ExcludeFieldsInterceptor)
  async confirmEmail(@Body() confirmEmailDto: AuthConfirmEmailDto): Promise<AuthConfirmResponse> {
    return await this.service.confirmEmail(confirmEmailDto.token);
  }

  @Post('email/login')
  @HttpCode(HttpStatus.OK)
  public login(@Body() loginDto: AuthEmailLoginDto): Promise<LoginResponseDto> {
    return this.service.login(loginDto);
  }
}
