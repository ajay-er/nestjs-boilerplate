import { Exclude } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Length, MinLength } from 'class-validator';

import { ToLowerCase } from '@/common/transformers';
import { AuthProviders } from '@/common/types';

export class AuthConfirmEmailDto {
  @IsNotEmpty()
  token: string;
}

export class AuthConfirmResponse {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  @IsString()
  @Length(2, 70)
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 70)
  lastName: string;

  @ToLowerCase()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Exclude()
  @MinLength(6)
  password: string;

  @Exclude()
  @IsEnum(AuthProviders)
  provider: AuthProviders;

  @IsOptional()
  imageUrl?: string;
}
