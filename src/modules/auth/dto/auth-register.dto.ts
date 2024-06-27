import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

import { ToLowerCase } from '@/common/transformers';

export class AuthRegisterDto {
  @ToLowerCase()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;
}
