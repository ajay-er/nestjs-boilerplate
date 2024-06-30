import { Type } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Length, MinLength, ValidateNested } from 'class-validator';

import { ToLowerCase } from '@/common/transformers';
import { Role, Status } from '@/common/types';

import { ProviderDto } from './provider.dto';

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
  @IsOptional()
  password?: string;

  @ValidateNested({ each: true })
  @Type(() => ProviderDto)
  @IsOptional()
  providers: ProviderDto[];

  @IsOptional()
  imageUrl?: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @IsEnum(Status)
  @IsOptional()
  status?: Status;
}
