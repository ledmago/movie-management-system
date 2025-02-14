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
import { TicketController } from './ticket/ticket.controller';
import { TicketService } from './ticket/ticket.service';

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
  ],
  controllers: [AppController, TicketController],
  providers: [AppService, AuthenticationService, TicketService],
})
export class AppModule {}
