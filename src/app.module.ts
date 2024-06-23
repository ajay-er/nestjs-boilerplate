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
        host: env.POSTGRES_HOST,
        port: env.POSTGRES_PORT,
        user: env.POSTGRES_USER,
        password: env.POSTGRES_PASSWORD,
        database: env.POSTGRES_DB,
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
