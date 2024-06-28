import type { Role } from './role.enum';

export type UserPayload = {
  id: number;
  role: Role;
};
