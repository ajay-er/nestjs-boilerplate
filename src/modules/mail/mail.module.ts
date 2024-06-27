import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';

import { env } from '@/common/config';

import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: env.MAIL_HOST,
        port: env.MAIL_PORT,
        secure: env.MAIL_SECURE,
        auth: {
          user: env.MAIL_USER,
          pass: env.MAIL_PASSWORD,
        },
      },
      defaults: {
        from: `"No Reply" <${env.MAIL_DEFAULT_EMAIL}>`,
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
