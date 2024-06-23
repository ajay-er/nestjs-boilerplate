/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'drizzle-kit';

import { env } from '@/common/config';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/database/schema/*',
  out: './drizzle',
  dbCredentials: {
    host: env.POSTGRES_HOST,
    user: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
    database: env.POSTGRES_DB,
    port: env.POSTGRES_PORT,
    ssl: env.isProd ? true : false,
  },
  verbose: true,
  strict: true,
});
