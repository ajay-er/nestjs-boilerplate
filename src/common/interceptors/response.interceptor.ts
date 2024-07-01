import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import type { Observable } from 'rxjs';
import { map } from 'rxjs';

import type { AppResponse } from '@/common/types';

export class AppResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<unknown>
  ): Observable<AppResponse> | Promise<Observable<AppResponse>> {
    return next.handle().pipe(
      map((payload = {}): AppResponse => {
        return {
          success: true,
          error: null,
          data: payload,
        };
      })
    );
  }
}
