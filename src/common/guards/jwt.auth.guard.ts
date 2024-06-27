import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { JWT_ACCESS } from '@/modules/auth/strategy';

@Injectable()
export class JwtAuthGuard extends AuthGuard(JWT_ACCESS) {}
