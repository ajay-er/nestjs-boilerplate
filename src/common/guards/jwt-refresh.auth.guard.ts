import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { JWT_REFRESH } from '@/modules/auth/strategy';

@Injectable()
export class JwtRefreshAuthGuard extends AuthGuard(JWT_REFRESH) {}
