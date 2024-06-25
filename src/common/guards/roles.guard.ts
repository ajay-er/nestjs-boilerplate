import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ROLES_KEY } from '@/common/decorator';
import { ForbiddenError } from '@/common/error';
import type { UserPayload } from '@/common/types';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const roles = this.reflector.getAllAndMerge<Array<number | string>>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles || roles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as UserPayload;

    // If user or user role is not defined, deny access
    if (!user || !user.role) {
      throw new ForbiddenError();
    }

    if (!roles.map(String).includes(String(user.role))) {
      throw new ForbiddenError();
    }

    return true;
  }
}
