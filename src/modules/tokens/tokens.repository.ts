import { Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';

import type { TokenType } from '@/common/types';
import { DatabaseService } from '@/database/database.service';
import { tokens } from '@/database/schema';

@Injectable()
export class TokensRepository {
  constructor(private readonly database: DatabaseService) {}

  async create(token: string, userId: number, tokenType: TokenType, expiresAt: Date) {
    return await this.database.db.insert(tokens).values({
      token,
      userId,
      type: tokenType,
      expiresAt,
    });
  }

  async find(token: string) {
    const result = await this.database.db.selectDistinct().from(tokens).where(eq(tokens.token, token));
    return result[0];
  }

  async deleteOldToken(tokenType: TokenType, userId: number) {
    return await this.database.db.delete(tokens).where(and(eq(tokens.type, tokenType), eq(tokens.userId, userId)));
  }

  async delete(token: string) {
    return await this.database.db.delete(tokens).where(eq(tokens.token, token));
  }
}
