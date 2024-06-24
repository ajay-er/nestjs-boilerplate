import { Global, Logger, Module } from '@nestjs/common';
import { Pool } from 'pg';

import type { DatabaseOptions } from '@/database/utils';

import { DatabaseService } from './database.service';
import { ConfigurableDatabaseModule, CONNECTION_POOL, DATABASE_OPTIONS } from './utils';

/**
 * Global DatabaseModule for setting up the PostgreSQL connection pool.
 * This module uses dependency injection to provide a configured connection pool
 * and a DatabaseService to other modules in the application.
 */
@Global()
@Module({
  exports: [DatabaseService],
  providers: [
    DatabaseService,
    {
      provide: CONNECTION_POOL,
      inject: [DATABASE_OPTIONS],
      useFactory: async (databaseOptions: DatabaseOptions) => {
        const logger = new Logger();

        // Create a new PostgreSQL connection pool with the given options
        const pool = new Pool({
          host: databaseOptions.host,
          port: databaseOptions.port,
          user: databaseOptions.user,
          password: databaseOptions.password,
          database: databaseOptions.database,
          ssl: { rejectUnauthorized: false }, // Use SSL with relaxed security (not verifying server certificate)
        });

        // Test the database connection by running a simple query
        await pool.query('SELECT 1');

        logger.log('🚀 Database connection established successfully.');
        return pool;
      },
    },
  ],
})
export class DatabaseModule extends ConfigurableDatabaseModule {}
