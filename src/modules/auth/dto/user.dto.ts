import { Exclude } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Length, MinLength } from 'class-validator';

import { ToLowerCase } from '@/common/transformers';
import { Role, Status } from '@/common/types';

import type { ProviderDto } from './oauth-validate.dto';

export class UserResponse {
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
  providers?: ProviderDto[];

  @IsOptional()
  imageUrl?: string;

  @Exclude()
  @IsOptional()
  status: Status;

  @Exclude()
  @IsOptional()
  role: Role;
}
