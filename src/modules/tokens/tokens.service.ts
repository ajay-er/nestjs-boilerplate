import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
dayjs().format();

import { env } from '@/common/config';
import { BadRequestError } from '@/common/error';
import type { TokenType } from '@/common/types';

import { TokensRepository } from './tokens.repository';

@Injectable()
export class TokensService {
  constructor(private readonly tokenRepository: TokensRepository) {}

  async storeEmailToken(token: string, userId: number) {
    const expiresIn = env.AUTH_CONFIRM_EMAIL_TOKEN_EXPIRES_IN;
    const { value, unit } = this.parseExpiresIn(expiresIn);

    const expiresAt = dayjs()
      .add(value, unit as dayjs.ManipulateType)
      .toDate();

    return await this.tokenRepository.create(token, userId, expiresAt);
  }

  async revokeToken(tokenType: TokenType, userId: number) {
    return await this.tokenRepository.update(tokenType, userId);
  }

  async isTokenRevoked(token: string) {
    const result = await this.tokenRepository.find(token);
    if (!result) throw new BadRequestError('Invalid token or token does not exist.');
    return result.revoked;
  }

  async cleanupExpiredTokens(): Promise<void> {
    await this.tokenRepository.delete();
  }

  private parseExpiresIn(expiresIn: string) {
    const numericValue = parseInt(expiresIn);
    const unit = expiresIn.slice(-1);

    if (isNaN(numericValue)) {
      throw new Error(`Invalid expiresIn format: ${expiresIn}`);
    }

    switch (unit) {
      case 's':
        return { value: numericValue, unit: 'second' };
      case 'm':
        return { value: numericValue, unit: 'minute' };
      case 'h':
        return { value: numericValue, unit: 'hour' };
      case 'd':
        return { value: numericValue, unit: 'day' };
      default:
        throw new Error(`Unknown unit '${unit}' in expiresIn: ${expiresIn}`);
    }
  }
}
