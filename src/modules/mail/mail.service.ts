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
    const emailConfirmTitle: string = 'Confirm Email';

    const url = new URL(env.FRONTEND_DOMAIN + '/confirm-new-email');
    url.searchParams.set('token', mailData.data.token);

    await this.sendMail({
      to: mailData.to,
      subject: emailConfirmTitle,
      text: `${url.toString()} ${emailConfirmTitle}`,
      templatePath: join(__dirname, 'templates', 'confirm-new-email.hbs'),
      context: {
        title: emailConfirmTitle,
        url: url.toString(),
        actionTitle: emailConfirmTitle,
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
