import { Inject, Injectable } from '@nestjs/common';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import { CONNECTION_POOL } from '@/database/utils';

import { DatabaseSchema } from './schema';

@Injectable()
export class DatabaseService {
  public db: NodePgDatabase<typeof DatabaseSchema>;
  constructor(@Inject(CONNECTION_POOL) private readonly pool: Pool) {
    this.db = drizzle(this.pool, { schema: DatabaseSchema });
  }
}
