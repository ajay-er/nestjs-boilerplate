import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import type { User } from '@/database/schema';

@Injectable()
export class ExcludeFieldsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: User) => {
        data.password = undefined;
        data.role = undefined;
        data.provider = undefined;
        data.socialId = undefined;
        return data;
      })
    );
  }
}
