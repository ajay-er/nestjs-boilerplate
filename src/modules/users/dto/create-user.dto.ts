import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

import { ToLowerCase } from '@/common/transformers';
import { AuthProviders, Role, Status } from '@/common/types';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
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
