import { Global, Logger, Module } from '@nestjs/common';
import { Pool } from 'pg';

import type { DatabaseOptions } from '@/database/utils';

import { DatabaseService } from './database.service';
import { ConfigurableDatabaseModule, CONNECTION_POOL, DATABASE_OPTIONS } from './utils';

@Global()
@Module({
  exports: [DatabaseService],
  providers: [
    DatabaseService,
    {
      provide: CONNECTION_POOL,
      inject: [DATABASE_OPTIONS],
      useFactory: async (databaseOptions: DatabaseOptions) => {
        const logger = new Logger('DatabaseModule');

        const pool = new Pool({
          host: databaseOptions.host,
          port: databaseOptions.port,
          user: databaseOptions.user,
          password: databaseOptions.password,
          database: databaseOptions.database,
        });

        // Test the connection
        await pool.query('SELECT 1');

        logger.log('🚀 Database connection established successfully.');
        return pool;
      },
    },
  ],
})
export class DatabaseModule extends ConfigurableDatabaseModule {}
