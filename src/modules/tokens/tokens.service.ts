import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
dayjs().format();

import type { TokenType } from '@/common/types';

import { TokensRepository } from './tokens.repository';

@Injectable()
export class TokensService {
  constructor(private readonly tokenRepository: TokensRepository) {}

  async storeToken(token: string, userId: number, tokenType: TokenType, expiresIn: string) {
    const { value, unit } = this.parseExpiresIn(expiresIn);

    const expiresAt = dayjs()
      .add(value, unit as dayjs.ManipulateType)
      .toDate();

    return await this.tokenRepository.create(token, userId, tokenType, expiresAt);
  }

  async deleteOldToken(tokenType: TokenType, userId: number) {
    return await this.tokenRepository.deleteOldToken(tokenType, userId);
  }

  async deleteToken(token: string) {
    return await this.tokenRepository.delete(token);
  }

  async findToken(token: string) {
    return await this.tokenRepository.find(token);
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
