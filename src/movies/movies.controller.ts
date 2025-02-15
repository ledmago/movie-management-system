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
import { ManagerGuard } from "src/authentication/manager.guard";
import { Request } from 'express';
import { RequestWithUser } from "src/users/user.constants";
import { WatchMovieBodyDto, WatchMovieIdParamDto, WatchMovieSessionIdParamDto } from "src/watchhistory/dto/watch-movie.dto";
import { WatchHistory } from "src/watchhistory/watchhistory.schema";
import { Tickets } from "src/tickets/ticket.schema";
import { DeleteBulkMovieDto } from "./dto/delete-bulk-movie";
import { DeleteResult } from "mongoose";
import { CreateBulkMovieDto } from "./dto/create-movie.dto";
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
  @UseGuards(AuthGuard, ManagerGuard)
  @Post("bulk")
  async createBulkMovie(@Body() createBulkMovieDto: CreateBulkMovieDto): Promise<Movie[]> {
    return this.moviesService.createBulkMovie(createBulkMovieDto.movies);
  }

  @ApiBearerAuth("authorization")
  @UseGuards(AuthGuard, ManagerGuard)
  @Delete("bulk")
  async deleteBulkMovie(@Body() deleteBulkMovieDto: DeleteBulkMovieDto): Promise<DeleteResult> {
    return this.moviesService.deleteBulkMovie(deleteBulkMovieDto);
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

  @ApiBearerAuth("authorization")
  @UseGuards(AuthGuard)
  @Post(":movieId/:movieSessionId/watch")
  async watchMovie(
    @Param() params: WatchMovieIdParamDto,
    @Param() sessionParams: WatchMovieSessionIdParamDto,
  @Body() watchMovieDto: WatchMovieBodyDto,
    @Req() req: RequestWithUser
  ): Promise<{ message: string; watchHistory: WatchHistory; ticket: Tickets | null }> {
    const user = req.user;
    return this.moviesService.watchMovie({ movieId: params.movieId, movieSessionId: sessionParams.movieSessionId, watchMovieDto, user: req.user });
  }
}
