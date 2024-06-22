import type { NestApplication } from '@nestjs/core';
import { NestFactory } from '@nestjs/core';

import { AppModule } from '@/app.module';
import { env } from '@/common/config';
import { LoggerService } from '@/logger/logger.service';
import { swaggerApp } from '@/swagger';

async function bootstrap() {
  const app: NestApplication = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(LoggerService));

  await swaggerApp(app);
  await app.listen(env.PORT || 3000);
}
bootstrap();
