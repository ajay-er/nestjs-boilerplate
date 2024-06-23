import { Module } from '@nestjs/common';
import { LoggerModule as LoggingModule } from 'nestjs-pino';

import { env } from '@/common/config';
import { LoggerService } from '@/logger/logger.service';

@Module({
  providers: [LoggerService],
  exports: [LoggerService],
  imports: [
    LoggingModule.forRoot({
      pinoHttp: {
        name: env.APP_NAME,
        customProps: (_req, _res) => ({
          context: 'HTTP',
        }),
        level: env.isProd ? 'info' : 'debug',
        transport: env.isProd
          ? {
              targets: [
                {
                  target: 'pino/file',
                  options: {
                    destination: 'logs/app.log',
                    mkdir: true,
                  },
                },
                {
                  level: 'info',
                  target: 'pino/file',
                  options: {
                    destination: 1, // 1 is stdout
                  },
                },
              ],
            }
          : {
              targets: [
                {
                  level: 'info',
                  target: 'pino-pretty',
                  options: {
                    translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
                    singleLine: true,
                  },
                },
              ],
            },
      },
    }),
  ],
})
export class LoggerModule {}
