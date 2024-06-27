import { IsEmail, IsNotEmpty } from 'class-validator';

import { ToLowerCase } from '@/common/transformers';

export class AuthEmailLoginDto {
  @ToLowerCase()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}
