import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { JWT_ACCESS } from '@/modules/auth/strategy';

@Injectable()
export class JwtAccessAuthGuard extends AuthGuard(JWT_ACCESS) {}
