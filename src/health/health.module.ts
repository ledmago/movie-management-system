import { Logger, Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { ConfigService } from '@nestjs/config';
import { RedisService } from 'src/redis/redis.service';

@Module({
  controllers: [HealthController],
  providers: [
    HealthService,
    ConfigService,
    Logger,
    RedisService,
  ],
})
export class HealthModule {}
