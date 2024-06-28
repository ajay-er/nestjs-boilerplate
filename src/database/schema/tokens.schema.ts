import type { InferSelectModel } from 'drizzle-orm';
import { integer, pgEnum, pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';

import { users } from './users.schema';

export const tokenTypeEnum = pgEnum('token_type', [
  'email_verification',
  'reset_password',
  'forgot_password',
  'refresh_token',
]);

export const tokens = pgTable('tokens', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  token: varchar('token').notNull().unique(),
  type: tokenTypeEnum('token_type').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
});

export type Token = InferSelectModel<typeof tokens>;
