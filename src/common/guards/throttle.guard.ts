import type { ExecutionContext } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import type { ThrottlerLimitDetail } from '@nestjs/throttler/dist/throttler.guard.interface';

import { TooManyRequestsError } from '@/common/error';

/**
 * Custom throttler guard that extends the built-in ThrottlerGuard.
 *
 * This guard overrides the default throttling behavior to use a custom tracker
 * and throws a custom `TooManyRequestsError` exception when the rate limit is exceeded.
 */
@Injectable()
export class AppThrottlerGuard extends ThrottlerGuard {
  /**
   * Returns a unique key to track the number of requests.
   *
   * @param req - The request object.
   * @returns The IP address of the client making the request.
   */
  protected async getTracker(req: Record<string, any>): Promise<string> {
    // Extract the X-Forwarded-For header value
    const xForwardedFor = req.headers['x-forwarded-for'];
    if (xForwardedFor) {
      // Split the header to handle multiple IP addresses and take the first one
      const clientIp = xForwardedFor.split(',')[0].trim();
      return clientIp;
    }
    // Fallback to req.ip if X-Forwarded-For is not present
    return req.ips.length ? req.ips[0] : req.ip;
  }

  /**
   * Throws a custom throttling exception when the rate limit is exceeded.
   *
   * @param _context - The execution context of the current request.
   * @param _throttlerLimitDetail - Details of the throttling limit.
   * @throws TooManyRequestsError - When the rate limit is exceeded.
   */
  protected throwThrottlingException(
    _context: ExecutionContext,
    _throttlerLimitDetail: ThrottlerLimitDetail
  ): Promise<void> {
    throw new TooManyRequestsError();
  }
}
