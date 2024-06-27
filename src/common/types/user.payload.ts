import type { Role } from './role.enum';

export type UserPayload = {
  id: string;
  role: Role;
};
