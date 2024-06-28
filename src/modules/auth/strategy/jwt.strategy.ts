import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { env } from '@/common/config';
import { UnauthorizedError } from '@/common/error';
import type { JwtPayload } from '@/common/types';
import { UsersService } from '@/modules/users/users.service';

import { JWT_ACCESS } from './strategy.token';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, JWT_ACCESS) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: env.AUTH_JWT_SECRET,
      ignoreExpiration: false,
    });
  }

  public async validate(payload: JwtPayload) {
    const user = await this.usersService.findById(payload.id);

    if (!user) {
      throw new UnauthorizedError();
    }

    return user;
  }
}
