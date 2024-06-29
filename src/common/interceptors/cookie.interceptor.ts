import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { Response } from 'express';
import { type Observable, tap } from 'rxjs';

import { TokenType } from '@/common/types';

@Injectable()
export class CookieInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      tap((data) => {
        if (data && data.refreshToken) {
          response.cookie(TokenType.RefreshToken, data.refreshToken, { httpOnly: true });
        }
      })
    );
  }
}
