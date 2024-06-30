import { Type } from 'class-transformer';
import { IsEmail, IsEnum, IsOptional, IsString, Length, ValidateNested } from 'class-validator';

import { ToLowerCase } from '@/common/transformers';
import { Status } from '@/common/types';

import { ProviderDto } from './provider.dto';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Length(2, 70)
  firstName?: string;

  @IsOptional()
  @IsString()
  @Length(2, 70)
  lastName?: string;

  @IsOptional()
  @ToLowerCase()
  @IsEmail()
  email?: string;

  @IsOptional()
  imageUrl?: string;

  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @ValidateNested({ each: true })
  @Type(() => ProviderDto)
  @IsOptional()
  providers?: ProviderDto[];
}
