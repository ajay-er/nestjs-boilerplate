import { Injectable } from '@nestjs/common';
import { and, eq, lt } from 'drizzle-orm';

import { TokenType } from '@/common/types';
import { DatabaseService } from '@/database/database.service';
import { tokens } from '@/database/schema';

@Injectable()
export class TokensRepository {
  constructor(private readonly database: DatabaseService) {}

  async create(token: string, userId: number, expiresAt: Date) {
    return await this.database.db.insert(tokens).values({
      token,
      userId,
      type: TokenType.EmailVerification,
      expiresAt,
    });
  }

  async update(tokenType: TokenType, userId: number) {
    return await this.database.db
      .update(tokens)
      .set({
        revoked: true,
      })
      .where(and(eq(tokens.userId, userId), eq(tokens.revoked, false), eq(tokens.type, tokenType)));
  }

  async find(token: string) {
    const result = await this.database.db.selectDistinct().from(tokens).where(eq(tokens.token, token));
    return result[0];
  }

  async delete() {
    return await this.database.db.delete(tokens).where(lt(tokens.expiresAt, new Date()));
  }
}
