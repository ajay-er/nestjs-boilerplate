import { Logger } from '@nestjs/common';
import type { NestApplication } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { env } from '@/common/config';

export const swaggerApp = async (app: NestApplication) => {
  const logger = new Logger();
  const appName = env.APP_NAME;

  const docPrefix = '/docs';
  const docDescription = `Explore the API documentation for ${appName}, a robust Node.js boilerplate with NestJS. This framework offers scalability and maintainability for building production-ready applications. Features include authentication, CRUD operations, and more`;
  const docVersion = '1.0';

  const config = new DocumentBuilder()
    .setTitle(appName)
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

  logger.log('==========================================================');

  logger.log(`Swagger Docs will serve on ${docPrefix}`, 'NestApplication');

  logger.log('==========================================================');
};
