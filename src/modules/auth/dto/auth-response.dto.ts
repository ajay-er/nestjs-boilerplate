import type { UserResponse } from './user.dto';

export class AuthSuccessResponseDto {
  accessToken: string;

  refreshToken: string;

  user: UserResponse;
}
