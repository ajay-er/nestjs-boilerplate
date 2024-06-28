import type { InferSelectModel } from 'drizzle-orm';
import { pgEnum, pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('role', ['admin', 'user']);
export const statusEnum = pgEnum('status', ['active', 'inactive']);
export const providerEnum = pgEnum('provider', ['email', 'google']);

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  firstName: varchar('firstName', { length: 70 }),
  lastName: varchar('lastName', { length: 70 }),
  email: varchar('email', { length: 255 }).unique(),
  password: varchar('password'),
  provider: providerEnum('provider').notNull(),
  role: roleEnum('role').default('user').notNull(),
  status: statusEnum('status').default('inactive').notNull(),
  imageUrl: varchar('imageUrl'),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .$onUpdate(() => new Date())
    .notNull(),
});

export type User = InferSelectModel<typeof users>;
