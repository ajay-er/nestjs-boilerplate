import { Body, Controller, HttpCode, HttpStatus, Post, UseInterceptors } from '@nestjs/common';

import { ExcludeFieldsInterceptor } from '@/common/interceptors';
import type { User } from '@/database/schema';

import { AuthService } from './auth.service';
import { AuthConfirmEmailDto } from './dto/auth-confirm.dto';
import { AuthRegisterDto } from './dto/auth-register.dto';

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
  async confirmEmail(@Body() confirmEmailDto: AuthConfirmEmailDto): Promise<User> {
    return await this.service.confirmEmail(confirmEmailDto.token);
  }
}
