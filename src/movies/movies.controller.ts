import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { Movie } from './movies.schema';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { GetMoviesDto } from './dto/get-movies.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Controller('movie')
export class MoviesController {
    constructor(private readonly moviesService: MoviesService) {}

    @Post()
    async createMovie(@Body() createMovieDto: CreateMovieDto): Promise<Movie> {
        return this.moviesService.createMovie(createMovieDto);
    }

    @Get()
    async getMovies(@Query() getMoviesDto: GetMoviesDto): Promise<Movie[]> {
        return this.moviesService.getMovies(getMoviesDto);
    }

    @Get(':id')
    async getMovieById(@Param('id') id: string): Promise<Movie> {
        return this.moviesService.getMovieById(id);
    }

    @Put(':id')
    async updateMovie(
        @Param('id') id: string,
        @Body() updateMovieDto: UpdateMovieDto
    ): Promise<Movie | null> {
        return this.moviesService.updateMovie({ id, updateMovieDto });
    }

    @Delete(':id')
    async deleteMovie(@Param('id') id: string): Promise<void> {
        await this.moviesService.deleteMovie(id);
    }

    
}
