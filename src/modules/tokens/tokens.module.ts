import { Module } from '@nestjs/common';

import { TokensRepository } from './tokens.repository';
import { TokensService } from './tokens.service';

@Module({
  providers: [TokensService, TokensRepository],
  exports: [TokensService],
})
export class TokensModule {}
