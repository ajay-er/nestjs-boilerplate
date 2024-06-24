import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';

import { env } from '@/common/config';
import { AppThrottlerGuard } from '@/common/guards';
import { LoggerModule } from '@/logger/logger.module';
import { FeatureModules } from '@/modules/feature.module';

import { DatabaseModule } from './database/database.module';
@Module({
  imports: [
    DatabaseModule.forRootAsync({
      useFactory: () => ({
        host: env.DATABASE_HOST,
        port: env.DATABASE_PORT,
        user: env.DATABASE_USERNAME,
        password: env.DATABASE_PASSWORD,
        database: env.DATABASE_NAME,
        maxConnections: env.DATABASE_MAX_CONNECTIONS,
        sslEnabled: env.DATABASE_SSL_ENABLED,
        rejectUnauthorized: env.DATABASE_REJECT_UNAUTHORIZED,
      }),
    }),
    ThrottlerModule.forRoot([
      {
        ttl: env.THROTTLE_TTL,
        limit: env.THROTTLE_LIMIT,
      },
    ]),
    LoggerModule,
    FeatureModules,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AppThrottlerGuard,
    },
  ],
})
export class AppModule {}
