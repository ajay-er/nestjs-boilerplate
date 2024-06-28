import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { MailModule } from '@/modules/mail/mail.module';
import { TokensModule } from '@/modules/tokens/tokens.module';
import { UsersModule } from '@/modules/users/users.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [JwtModule.register({}), UsersModule, MailModule, TokensModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
