import { IsNotEmpty } from 'class-validator';

export class AuthConfirmEmailDto {
  @IsNotEmpty()
  token: string;
}
