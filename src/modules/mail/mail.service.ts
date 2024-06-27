import { promises as fs } from 'node:fs';
import { join } from 'node:path';

import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import Handlebars from 'handlebars';

import { env } from '@/common/config';
import type { MailData } from '@/modules/mail/interfaces';

@Injectable()
export class MailService {
  constructor(private readonly mailService: MailerService) {}

  async confirmNewEmail(mailData: MailData<{ token: string }>): Promise<void> {
    const url = new URL(env.FRONTEND_DOMAIN + '/auth/confirm');
    url.searchParams.set('token', mailData.data.token);

    await this.sendMail({
      to: mailData.to,
      subject: `Welcome to ${env.APP_NAME}! Confirm your Email`,
      text: `${url.toString()} Confirm your new email address.`,
      templatePath: join(__dirname, 'templates', 'confirm-email.hbs'),
      context: {
        title: 'Confirm Your Email',
        url: url.toString(),
        actionTitle: 'Confirm Email',
        app_name: env.APP_NAME,
        text1: 'Hey!',
        text2: 'Confirm your new email address.',
        text3: 'Simply click the button below to verify your email address',
      },
    });
  }

  private async sendMail({ templatePath, context, ...mailOptions }): Promise<void> {
    try {
      let html: string | undefined;
      if (templatePath) {
        const template = await fs.readFile(templatePath, 'utf-8');
        html = Handlebars.compile(template, {
          strict: true,
        })(context);
      }

      await this.mailService.sendMail({
        ...mailOptions,
        from: mailOptions.from ? mailOptions.from : `"${env.MAIL_DEFAULT_NAME}" <${env.MAIL_DEFAULT_EMAIL}>`,
        html: mailOptions.html ? mailOptions.html : html,
      });
    } catch (error) {
      console.error(error);
    }
  }
}
