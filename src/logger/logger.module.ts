import { Module } from '@nestjs/common';
import { LoggerModule as LoggingModule } from 'nestjs-pino';
import { pino } from 'pino';

import { env } from '@/common/config';
import { LoggerService } from '@/logger/logger.service';

@Module({
  providers: [LoggerService],
  exports: [LoggerService],
  imports: [
    LoggingModule.forRoot({
      pinoHttp: {
        name: env.APP_NAME,
        stream: pino.destination({
          dest: `app.log`,
          minLength: 4096,
          sync: false,
        }),
        customProps: (_req, _res) => ({
          context: 'HTTP',
        }),
        transport: env.isProd
          ? null
          : {
              target: 'pino-pretty',
              options: {
                translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
                singleLine: true,
              },
            },
      },
    }),
  ],
})
export class LoggerModule {}
