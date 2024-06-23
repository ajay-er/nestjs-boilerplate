import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthController {
  @Get()
  checkHealth() {
    return { status: 'ok' };
  }

  @Get('/status')
  checkStatus() {
    return { status: 'running', uptime: process.uptime() };
  }
}