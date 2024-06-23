import { Module } from '@nestjs/common';

import { LoggerModule } from '@/logger/logger.module';
import { HealthModule } from '@/modules/health/health.module';

@Module({
  imports: [LoggerModule, HealthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
