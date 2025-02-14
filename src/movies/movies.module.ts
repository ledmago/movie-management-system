import { Module } from "@nestjs/common";
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
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Movie.name, schema: MovieSchema }]),
  ],
  controllers: [MoviesController],
  providers: [
    MoviesService,
    MoviesRepository,
    JwtService,
    AuthenticationService,
    JwtService,
    Logger,
    RedisService,
  ],
  exports: [MoviesService]
})
export class MoviesModule {}
