import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { Response } from 'express';
import { type Observable, tap } from 'rxjs';

import { TokenType } from '@/common/types';

type TokenResponse = {
  refreshToken?: string;
  [key: string]: unknown;
};

@Injectable()
export class CookieInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<TokenResponse> {
    const response = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      tap((data) => {
        if (data && data.refreshToken) {
          response.cookie(TokenType.RefreshToken, data.refreshToken, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            maxAge: 24 * 60 * 60 * 1000,
          });
        }
      })
    );
  }
}
