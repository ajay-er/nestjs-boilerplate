import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { GOOGLE_OAUTH } from '@/modules/auth/strategy';

@Injectable()
export class GoogleOauthGuard extends AuthGuard(GOOGLE_OAUTH) {}
