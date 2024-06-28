import { Controller, Get, UseGuards } from '@nestjs/common';

import { JwtAccessAuthGuard } from '@/common/guards';

import { HealthService } from './health.service';

@Controller()
export class HealthController {
  constructor(private readonly service: HealthService) {}

  @Get()
  checkHealth() {
    return this.service.check();
  }

  @Get('/protected')
  @UseGuards(JwtAccessAuthGuard)
  wow() {
    return 'protected!!!';
  }
}
