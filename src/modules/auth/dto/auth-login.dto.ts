import { IsEmail, IsNotEmpty } from 'class-validator';

import { ToLowerCase } from '@/common/transformers';

import type { AuthConfirmResponse } from './auth-confirm.dto';

export class AuthEmailLoginDto {
  @ToLowerCase()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class LoginResponseDto {
  accessToken: string;

  refreshToken: string;

  user: AuthConfirmResponse;
}
