import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';

import { DatabaseService } from '@/database/database.service';
import type { User } from '@/database/schema';
import { users } from '@/database/schema';
import type { CreateUserDto } from '@/modules/users/dto/create-user.dto';

@Injectable()
export class UsersRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(user: CreateUserDto): Promise<User> {
    const result = await this.databaseService.db.insert(users).values(user).returning();
    return result[0];
  }

  async findByEmail(email: string): Promise<User> {
    const result = await this.databaseService.db.select().from(users).where(eq(users.email, email));
    return result[0];
  }
}
