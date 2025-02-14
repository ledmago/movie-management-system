import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class HealthService {
  private healty: boolean = false;

  constructor(
    private databaseService: DatabaseService,
    private redisService: RedisService,
  ) {}

  check() {
    const isDatabaseHealthy = this.databaseService.getHealthStatus();
    const isRedisHealthy = this.redisService.getHealth();
    this.healty = isDatabaseHealthy && isRedisHealthy;
    return { status: this.healty, time: Date.now() };
  }
}
