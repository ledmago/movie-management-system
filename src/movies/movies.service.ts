import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Movie, MovieDocument } from "./movies.schema";
import { CreateMovieDto } from "./dto/create-movie.dto";
import { MoviesRepository } from "./movies.repository";
import { GetMoviesDto } from "./dto/get-movies.dto";
import * as Exceptions from "./movies.exceptions";
import { UpdateMovieDto } from "./dto/update-movie.dto";
import { DeleteMovieResponseDto } from "./dto/delete-movie.dto";

@Injectable()
export class MoviesService {
  constructor(private readonly moviesRepository: MoviesRepository) {}

  async createMovie(createMovieDto: CreateMovieDto): Promise<Movie> {
    return this.moviesRepository.create(createMovieDto);
  }

  async getMovies(getMoviesDto: GetMoviesDto): Promise<Movie[]> {
    const { page = 1, limit = 10 } = getMoviesDto;
    const skip = (page - 1) * limit;
    return this.moviesRepository.findAll(skip, limit);
  }

  async getMovieById(id: string): Promise<Movie> {
    const movie = await this.moviesRepository.findById(id);
    if (!movie) {
      throw Exceptions.MovieNotFound();
    }
    return movie;
  }

  async updateMovie({
    id,
    updateMovieDto,
  }: {
    id: string;
    updateMovieDto: UpdateMovieDto;
  }): Promise<Movie | null> {
    const movie = await this.moviesRepository.findById(id);
    if (!movie) {
      throw Exceptions.MovieNotFound();
    }
    return this.moviesRepository.update({
      id,
      updateMovieDto,
    });
  }

  async deleteMovie(id: string): Promise<DeleteMovieResponseDto> {
    const movie = await this.moviesRepository.findById(id);
    if (!movie) {
      throw Exceptions.MovieNotFound();
    }
    await this.moviesRepository.delete(id);
    return {
      message: "Film başarıyla silindi",
    };
  }
}
