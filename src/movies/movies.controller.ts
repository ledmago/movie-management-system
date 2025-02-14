import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { Movie } from "./movies.schema";
import { MoviesService } from "./movies.service";
import { CreateMovieDto } from "./dto/create-movie.dto";
import { GetMoviesDto } from "./dto/get-movies.dto";
import { UpdateMovieDto } from "./dto/update-movie.dto";
import { AuthGuard } from "src/authentication/authentication.guard";
import { ApiBearerAuth } from "@nestjs/swagger";
import { ManagerGuard } from "src/auth/guards/manager.guard";
import { Request } from 'express';
import { RequestWithUser } from "src/users/user.constants";
@Controller("movie")
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @ApiBearerAuth("authorization")
  @UseGuards(AuthGuard, ManagerGuard)
  @Post()
  async createMovie(@Body() createMovieDto: CreateMovieDto): Promise<Movie> {
    return this.moviesService.createMovie(createMovieDto);
  }

  @ApiBearerAuth("authorization")
  @UseGuards(AuthGuard)
  @Get()
  async getAvailableMovies(@Query() getMoviesDto: GetMoviesDto, @Req() req: RequestWithUser): Promise<Movie[]> {
    const user = req.user;
    return this.moviesService.getAvailableMovies(getMoviesDto, user);
  }

  @ApiBearerAuth("authorization")
  @UseGuards(AuthGuard)
  @Get(":id")
  async getMovieById(@Param("id") id: string): Promise<Movie> {
    return this.moviesService.getMovieById(id);
  }

  @ApiBearerAuth("authorization")
  @UseGuards(AuthGuard, ManagerGuard)
  @Put(":id")
  async updateMovie(
    @Param("id") id: string,
    @Body() updateMovieDto: UpdateMovieDto
  ): Promise<Movie | null> {
    return this.moviesService.updateMovie({ id, updateMovieDto });
  }

  @ApiBearerAuth("authorization")
  @UseGuards(AuthGuard, ManagerGuard)
  @Delete(":id")
  async deleteMovie(@Param("id") id: string): Promise<void> {
    await this.moviesService.deleteMovie(id);
  }
}
