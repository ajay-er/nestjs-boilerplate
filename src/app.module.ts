import { Module } from '@nestjs/common';

import { LoggerModule } from '@/logger/logger.module';
import { FeatureModules } from '@/modules/feature.module';

@Module({
  imports: [LoggerModule, FeatureModules],
  controllers: [],
  providers: [],
})
export class AppModule {}
