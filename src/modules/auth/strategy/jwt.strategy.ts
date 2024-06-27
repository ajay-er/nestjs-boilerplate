import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { env } from '@/common/config';
import type { JwtPayload } from '@/common/types';

import { JWT_ACCESS } from './strategy.token';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, JWT_ACCESS) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: env.AUTH_JWT_SECRET,
      ignoreExpiration: false,
    });
  }

  public validate(payload: JwtPayload) {
    return payload;
  }
}
