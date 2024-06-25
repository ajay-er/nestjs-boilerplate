import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { GenericExceptionFilter, HttpExceptionFilter, RootExceptionFilter } from '@/common/filter';
import { HealthModule } from '@/modules/health/health.module';
import { UsersModule } from '@/modules/users/users.module';

@Module({
  imports: [HealthModule, UsersModule],
  providers: [
    // Declare the "Catch anything" filter first
    {
      provide: APP_FILTER,
      useClass: GenericExceptionFilter,
    },
    // Then declare other filters in the desired order
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: RootExceptionFilter,
    },
  ],
})
export class FeatureModules {}
