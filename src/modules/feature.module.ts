import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';

import { GenericExceptionFilter, HttpExceptionFilter, RootExceptionFilter } from '@/common/filter';
import { AuthModule } from '@/modules/auth/auth.module';
import { JwtStrategy } from '@/modules/auth/strategy';
import { HealthModule } from '@/modules/health/health.module';
import { MailModule } from '@/modules/mail/mail.module';
import { TokensModule } from '@/modules/tokens/tokens.module';
import { UsersModule } from '@/modules/users/users.module';

@Module({
  imports: [HealthModule, UsersModule, AuthModule, MailModule, PassportModule, TokensModule],
  providers: [
    // Declare the "Catch anything" filter first
    {
      provide: APP_FILTER,
      useClass: GenericExceptionFilter,
    },
    // Then declare other filters in the desired order
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: RootExceptionFilter,
    },
    JwtStrategy,
  ],
})
export class FeatureModules {}
