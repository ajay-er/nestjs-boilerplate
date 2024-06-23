import type { NestApplication } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { LoggerService } from './logger/logger.service';

type SwaggerConfig = {
  title: string;
  description?: string;
  version?: string;
  docPrefix?: string;
};

export const swaggerApp = async (app: NestApplication, options: SwaggerConfig) => {
  const logger = app.get<LoggerService>(LoggerService);
  const appName = options.title;

  const docPrefix = options.docPrefix ?? '/docs';
  const docDescription = options.description ?? `Explore the API documentation for ${appName}.`;
  const docVersion = options.version ?? '1.0';

  const config = new DocumentBuilder()
    .setTitle(options.title)
    .setDescription(docDescription)
    .setVersion(docVersion)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
  });

  SwaggerModule.setup(docPrefix, app, document, {
    jsonDocumentUrl: `${docPrefix}/json`,
    yamlDocumentUrl: `${docPrefix}/yaml`,
    customSiteTitle: appName,
    swaggerOptions: {
      persistAuthorization: true,
      displayOperationId: true,
      operationsSorter: 'method',
      tagsSorter: 'alpha',
      tryItOutEnabled: true,
      deepLinking: true,
    },
  });

  logger.info(`Swagger Docs will serve on ${docPrefix}`);
};
