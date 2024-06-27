import type { UserPayload } from './user.payload';

export type JwtPayload = Pick<UserPayload, 'id' | 'role'> & {
  iat: number;
  exp: number;
};
