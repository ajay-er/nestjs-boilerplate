import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Length, MinLength } from 'class-validator';

import { ToLowerCase } from '@/common/transformers';
import { AuthProviders, Role, Status } from '@/common/types';

export class CreateUserDto {
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

  @MinLength(6)
  password: string;

  @IsEnum(AuthProviders)
  provider: AuthProviders;

  @IsOptional()
  @IsString()
  socialId?: string;

  @IsOptional()
  imageUrl?: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @IsEnum(Status)
  @IsOptional()
  status?: Status;
}
