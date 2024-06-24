/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'drizzle-kit';

import { env } from '@/common/config';

/**
 * Configuration for the Drizzle Kit.
 *
 * This configuration defines settings for the PostgreSQL database connection.
 * It includes database credentials, schema location, output directory, and
 * other options like verbosity and strict mode.
 */
export default defineConfig({
  dialect: 'postgresql',
  schema: './src/database/schema/*',
  out: './drizzle',
  dbCredentials: {
    host: env.DATABASE_HOST,
    user: env.DATABASE_USERNAME,
    password: env.DATABASE_PASSWORD,
    database: env.DATABASE_NAME,
    port: env.DATABASE_PORT,
    ssl: env.DATABASE_SSL_ENABLED
      ? {
          rejectUnauthorized: env.DATABASE_REJECT_UNAUTHORIZED || false,
          ca: env.DATABASE_CA ?? undefined,
          key: env.DATABASE_KEY ?? undefined,
          cert: env.DATABASE_CERT ?? undefined,
        }
      : false,
  },
  verbose: true,
  strict: true,
});
