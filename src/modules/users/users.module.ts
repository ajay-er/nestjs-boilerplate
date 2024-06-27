import { Module } from '@nestjs/common';

import { UsersRepositoryModule } from './repository/users.repository.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
  imports: [UsersRepositoryModule],
})
export class UsersModule {}
