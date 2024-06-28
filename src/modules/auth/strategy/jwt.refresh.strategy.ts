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
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: env.AUTH_REFRESH_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(_req: Request, payload: JwtPayload) {
    const user = await this.usersService.findById(payload.id);

    if (!user) {
      throw new UnauthorizedError();
    }

    return user;
  }
}
