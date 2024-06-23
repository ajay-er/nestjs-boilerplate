import { Injectable } from '@nestjs/common';
import { DiskHealthIndicator, HealthCheckService, MemoryHealthIndicator } from '@nestjs/terminus';

@Injectable()
export class HealthService {
  constructor(
    private readonly health: HealthCheckService,
    private readonly disk: DiskHealthIndicator,
    private readonly memory: MemoryHealthIndicator
  ) {}

  /**
   *
   * Storage: Use if 50% or upper
   * Memory: Use if more than 300 MB
   */
  check() {
    return this.health.check([
      () => this.disk.checkStorage('storage', { path: '/', thresholdPercent: 0.5 }),
      () => this.memory.checkHeap('memory', 300 * 1024 * 1024),
    ]);
  }
}
