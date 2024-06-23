import type { NestApplication } from '@nestjs/core';
import { NestFactory } from '@nestjs/core';

import { AppModule } from '@/app.module';
import { env } from '@/common/config';
import { AppResponseInterceptor } from '@/common/interceptors';
import { LoggerService } from '@/logger/logger.service';
import { swaggerApp } from '@/swagger';

async function bootstrap() {
  // Create a NestJS application instance
  const app: NestApplication = await NestFactory.create(AppModule, { bufferLogs: true });

  // Configure logger service to be used globally
  app.useLogger(app.get(LoggerService));

  // Register a global interceptor for handling outgoing responses
  app.useGlobalInterceptors(new AppResponseInterceptor());

  // Integrate Swagger UI and API documentation into the application
  await swaggerApp(app, { title: env.APP_NAME });

  // Start the application
  await app.listen(env.PORT || 3000);
}
bootstrap();
