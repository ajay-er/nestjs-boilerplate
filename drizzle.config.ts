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
    host: env.POSTGRES_HOST,
    user: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
    database: env.POSTGRES_DB,
    port: env.POSTGRES_PORT,
    ssl: { rejectUnauthorized: false }, // Enable SSL certificate validation for production environments
  },
  verbose: true,
  strict: true,
});
