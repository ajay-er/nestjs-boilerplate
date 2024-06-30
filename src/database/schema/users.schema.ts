import type { InferSelectModel } from 'drizzle-orm';
import { jsonb, pgEnum, pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';

import type { AuthProviders } from '@/common/types';

export const roleEnum = pgEnum('role', ['admin', 'user']);
export const statusEnum = pgEnum('status', ['active', 'inactive']);

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  firstName: varchar('firstName', { length: 70 }).notNull(),
  lastName: varchar('lastName', { length: 70 }),
  email: varchar('email', { length: 255 }).unique(),
  password: varchar('password'),
  providers: jsonb('providers').array().notNull().$type<Array<{ provider: AuthProviders; providerId?: string }>>(),
  role: roleEnum('role').default('user').notNull(),
  status: statusEnum('status').default('inactive').notNull(),
  imageUrl: varchar('imageUrl'),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .$onUpdate(() => new Date())
    .notNull(),
});

export type User = InferSelectModel<typeof users>;
