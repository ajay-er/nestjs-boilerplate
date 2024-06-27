import { Controller, Get, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@/common/guards/jwt.auth.guard';

import { HealthService } from './health.service';

@Controller()
export class HealthController {
  constructor(private readonly service: HealthService) {}

  @Get()
  checkHealth() {
    return this.service.check();
  }

  @Get('/protected')
  @UseGuards(JwtAuthGuard)
  wow() {
    return 'protected!!!';
  }
}
