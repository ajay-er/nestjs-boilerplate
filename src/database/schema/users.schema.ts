import { pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  firstName: varchar('firstName', { length: 70 }),
  lastName: varchar('lastName', { length: 70 }),
  email: varchar('email', { length: 255 }).unique(),
  password: varchar('password'),
  provider: varchar('provider', { length: 255 }).notNull(),
  socialId: varchar('socialId', { length: 255 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});
