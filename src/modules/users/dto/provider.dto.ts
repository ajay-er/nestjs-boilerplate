import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { AuthProviders } from '@/common/types';

export class ProviderDto {
  @IsEnum(AuthProviders)
  @IsNotEmpty()
  provider: AuthProviders;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  providerId?: string;
}
