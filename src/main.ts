import { type ValidationError, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';

import { AppModule } from '@/app.module';
import { env } from '@/common/config';
import { BadRequestError } from '@/common/error';
import { AppResponseInterceptor } from '@/common/interceptors';
import { LoggerService } from '@/logger/logger.service';
import { swaggerApp } from '@/swagger';

async function bootstrap() {
  // Create NestJS application instance
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { bufferLogs: true });

  // Integrate Swagger UI and API documentation into the application
  await swaggerApp(app, { title: env.APP_NAME });

  // Enable trust proxy for Express
  app.set('trust proxy', true);

  // Enable CORS with configured origin and credentials
  app.enableCors({ origin: env.CORS_ORIGIN, credentials: true });

  // Configure logger service to be used globally
  app.useLogger(app.get(LoggerService));

  // Register a global interceptor for handling outgoing responses
  app.useGlobalInterceptors(new AppResponseInterceptor());

  // Middleware to parse cookies from incoming requests
  app.use(cookieParser());

  // Use Helmet middleware to set security headers
  app.use(helmet());

  // Global validation pipe for validating incoming request payloads
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Automatically transforms payload to DTO instance
      whitelist: true, // Strips non-whitelisted properties
      forbidNonWhitelisted: true, // Throws an error if unknown properties are present
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        const firstError = validationErrors[0];
        const firstConstraint = firstError.constraints ? Object.values(firstError.constraints)[0] : 'Validation error';
        return new BadRequestError(firstConstraint);
      },
    })
  );

  // Start the application
  await app.listen(env.PORT || 3000);
}

bootstrap();
