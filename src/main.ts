import type { NestApplication } from '@nestjs/core';
import { NestFactory } from '@nestjs/core';

import { AppModule } from '@/app.module';
import { env } from '@/common/config';
import { swaggerApp } from '@/swagger';

async function bootstrap() {
  const app: NestApplication = await NestFactory.create(AppModule);

  await swaggerApp(app);
  await app.listen(env.PORT || 3000);
}
bootstrap();
