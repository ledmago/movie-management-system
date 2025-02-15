import { Module, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Movie, MovieSchema } from "./movies.schema";
import { MoviesController } from "./movies.controller";
import { MoviesService } from "./movies.service";
import { MoviesRepository } from "./movies.repository";
import { JwtService } from "@nestjs/jwt";
import { AuthenticationService } from "src/authentication/authentication.service";
import { UsersService } from "src/users/users.service";
import { Logger } from "@nestjs/common";
import { RedisService } from "src/redis/redis.service";
import { UsersRepository } from "src/users/users.repository";
import { UsersModule } from "src/users/users.module";
import { AuthenticationModule } from "src/authentication/authentication.module";
import { TicketsModule } from "src/tickets/tickets.module";
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Movie', schema: MovieSchema }]),
    UsersModule,
    AuthenticationModule,
    TicketsModule,
  ],
  controllers: [MoviesController],
  providers: [MoviesService, MoviesRepository],
  exports: [MoviesService, MoviesRepository, MongooseModule],
})
export class MoviesModule {}
