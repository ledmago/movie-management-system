import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Movie, MovieSchema } from './movies.schema';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { MoviesRepository } from './movies.repository';
import { JwtService } from '@nestjs/jwt';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Movie.name, schema: MovieSchema }
    ])
  ],
  controllers: [MoviesController],
  providers: [MoviesService, MoviesRepository, JwtService],
})
export class MoviesModule {} 