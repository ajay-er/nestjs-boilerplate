import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { env } from '@/common/config';
import { UnauthorizedError } from '@/common/error';
import type { JwtPayload } from '@/common/types';
import { UsersService } from '@/modules/users/users.service';

import { JWT_REFRESH } from './strategy.token';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, JWT_REFRESH) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtRefreshStrategy.extractJwtCookies,
        // ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: env.AUTH_REFRESH_SECRET,
      ignoreExpiration: false,
    });
  }

  private static extractJwtCookies(req: Request): string | null {
    if (req.cookies && req.cookies.refresh_token) {
      return req.cookies.refresh_token;
    }
    return null;
  }

  async validate(payload: JwtPayload) {
    console.warn(payload);
    const user = await this.usersService.findById(payload.id);

    if (!user) {
      throw new UnauthorizedError();
    }

    return user;
  }
}
