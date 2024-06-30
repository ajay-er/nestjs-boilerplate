import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import type { VerifyCallback } from 'passport-google-oauth2';
import { Strategy } from 'passport-google-oauth2';

import { env } from '@/common/config';
import { AuthProviders } from '@/common/types';

import { AuthService } from '../auth.service';
import { GOOGLE_OAUTH } from './strategy.token';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, GOOGLE_OAUTH) {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: env.GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email'],
    });
  }

  async validate(_accessToken: string, _refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const { id, name, emails, photos } = profile;

    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      imageUrl: photos[0].value,
      providers: { provider: AuthProviders.GOOGLE, providerId: id },
    };

    const oauthUser = this.authService.validateOAuthUser(user);
    done(null, oauthUser);
  }
}
