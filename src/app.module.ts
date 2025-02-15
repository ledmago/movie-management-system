import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configuration } from './common/configuration';
import { RedisModule } from './redis/redis.module';
import { UsersModule } from './users/users.module';
import { AuthenticationService } from './authentication/authentication.service';
import { AuthenticationModule } from './authentication/authentication.module';
import { MoviesModule } from './movies/movies.module';
import { TicketsModule } from './tickets/tickets.module';
import { WatchhistoryService } from './watchhistory/watchhistory.service';
import { WatchhistoryModule } from './watchhistory/watchhistory.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
      load: [configuration],
    }),
    DatabaseModule,
    HealthModule,
    AuthenticationModule,
    RedisModule,
    UsersModule,
    MoviesModule,
    TicketsModule,
    WatchhistoryModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthenticationService, WatchhistoryService],
})
export class AppModule {}
