import { ValidationPipe } from '@nestjs/common';
import type { NestApplication } from '@nestjs/core';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';

import { AppModule } from '@/app.module';
import { env } from '@/common/config';
import { AppResponseInterceptor } from '@/common/interceptors';
import { LoggerService } from '@/logger/logger.service';
import { swaggerApp } from '@/swagger';

async function bootstrap() {
  // Create NestJS application instance
  const app: NestApplication = await NestFactory.create(AppModule, { bufferLogs: true });

  // Integrate Swagger UI and API documentation into the application
  await swaggerApp(app, { title: env.APP_NAME });

  // Enable CORS with configured origin and credentials
  app.enableCors({ origin: env.CORS_ORIGIN, credentials: true });

  // Configure logger service to be used globally
  app.useLogger(app.get(LoggerService));

  // Register a global interceptor for handling outgoing responses
  app.useGlobalInterceptors(new AppResponseInterceptor());

  // Use Helmet middleware to set security headers
  app.use(helmet());

  // Global validation pipe for validating incoming request payloads
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Automatically transforms payload to DTO instance
      whitelist: true, // Strips non-whitelisted properties
      forbidNonWhitelisted: true, // Throws an error if unknown properties are present
    })
  );

  // Start the application
  await app.listen(env.PORT || 3000);
}

bootstrap();
