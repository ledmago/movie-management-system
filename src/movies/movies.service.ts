import { Inject, forwardRef, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, DeleteResult } from "mongoose";
import { Movie, MovieDocument, Session } from "./movies.schema";
import { CreateMovieDto } from "./dto/create-movie.dto";
import { MoviesRepository } from "./movies.repository";
import { GetMoviesDto } from "./dto/get-movies.dto";
import * as Exceptions from "./movies.exceptions";
import { UpdateMovieDto } from "./dto/update-movie.dto";
import { DeleteMovieResponseDto } from "./dto/delete-movie.dto";
import { User } from "src/users/users.schema";
import { WatchMovieBodyDto } from "src/watchhistory/dto/watch-movie.dto";
import { TicketsService } from "src/tickets/tickets.service";
import { WatchHistoryService } from "src/watchhistory/watchhistory.service";
import { WatchHistory } from "src/watchhistory/watchhistory.schema";
import { Tickets } from "src/tickets/ticket.schema";
import { DeleteBulkMovieDto } from "./dto/delete-bulk-movie";
@Injectable()
export class MoviesService {
  constructor(
    private readonly moviesRepository: MoviesRepository,
    @Inject(forwardRef(() => TicketsService))
    private readonly ticketsService: TicketsService,
    private readonly WatchHistoryService: WatchHistoryService
  ) {}

  async createMovie(createMovieDto: CreateMovieDto): Promise<Movie> {
    const formattedCreateMovieDto = {
      ...createMovieDto,
      sessions: createMovieDto.sessions.map(
        ({ timeSlot, date, ...session }) => {
          const sessionAsDate = new Date(date);
          const startHour = Number(timeSlot.split("-")[0].split(":")[0]);
          const endHour = Number(timeSlot.split("-")[1].split(":")[0]);
          const startDate = new Date(
            sessionAsDate.setHours(startHour, 0, 0, 0)
          );
          const endDate = new Date(sessionAsDate.setHours(endHour, 0, 0, 0));
          return {
            ...session,
            startDate,
            endDate,
          };
        }
      ),
    };

    const isRoomTaken = await this.moviesRepository.findByRoomAndSessionByTime(formattedCreateMovieDto.sessions);
    if (isRoomTaken) {
      throw Exceptions.RoomAlreadyTaken();
    }
    return this.moviesRepository.create(formattedCreateMovieDto);
  }

  async getAvailableMovies(
    getMoviesDto: GetMoviesDto,
    user: User
  ): Promise<Movie[]> {
    const { page = 1, limit = 50 } = getMoviesDto;
    const skip = (page - 1) * limit;

    const currentTime = new Date();

    const movies = await this.moviesRepository.getAvailableMovies({
      name: getMoviesDto.name,
      ageRestriction: getMoviesDto.ageRestriction,
      skip,
      limit,
      currentTime,
      userAge: user.age,
    });
    return movies;
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
      message: "Movie başarıyla silindi",
    };
  }

  async getMovieAndSessionById(
    movieId: string,
    movieSessionId: string
  ): Promise<{
    movie: Movie;
    movieSession: Session | undefined;
  }> {
    const movie = await this.moviesRepository.findMovieAndSessionById({
      movieId,
      movieSessionId,
    });
    if (!movie) {
      throw Exceptions.MovieNotFound();
    }
    const movieSession = movie.sessions.find(
      (session: Session) => session?._id?.toString() === movieSessionId
    );

    if (!movieSession) {
      throw Exceptions.MovieSessionNotFound();
    }

    return {
      movie,
      movieSession,
    };
  }

  validateMovieSession(movieSession: Session): void {
   const endDate = new Date(movieSession.endDate);
   const currentDate = new Date();
   if (endDate < currentDate) {
    throw Exceptions.MovieSessionExpired();
   }

   const startDate = new Date(movieSession.startDate);
   const timeDifference = startDate.getTime() - currentDate.getTime();
   const hourDifference = timeDifference / (1000 * 60 * 60);

   if (hourDifference > 1) {
    throw Exceptions.MovieSessionStartsInMoreThanOneHour();
   }
  }

  async watchMovie({
    movieId,
    movieSessionId,
    watchMovieDto,
    user,
  }: {
    movieId: string;
    movieSessionId: string;
    watchMovieDto: WatchMovieBodyDto;
    user: User;
  }): Promise<{ message: string; watchHistory: WatchHistory; ticket: Tickets | null }> {
    const { ticketId } = watchMovieDto;
    const { movie, movieSession } = await this.getMovieAndSessionById(
      movieId,
      movieSessionId
    );

    if (!movieSession) {
      throw Exceptions.MovieSessionNotFound();
    }

    this.validateMovieSession(movieSession);

    const ticket = await this.ticketsService.useTicket({
      movieId,
      movieSessionId,
      ticketId,
      userId: user?._id?.toString() ?? "",
    });

    const watchHistory = await this.WatchHistoryService.createWatchHistory({
      movieId,
      movieSessionId,
      userId: user?._id?.toString() ?? "",
      ticketId,
    });

    await this.WatchHistoryService.deleteWatchHistoryFromCache(user?._id?.toString() ?? "");

    return {
      message: "success", 
      watchHistory,
      ticket,
    };
  }

  async deleteBulkMovie(deleteBulkMovieDto: DeleteBulkMovieDto): Promise<DeleteResult> {
    const { movieIds } = deleteBulkMovieDto;
    const movies = await this.moviesRepository.deleteBulk(movieIds);
    return movies;
  }
  
  async createBulkMovie(createMovieDtos: CreateMovieDto[]): Promise<Movie[]> {
    const session = await this.moviesRepository.startSession();
    const createdMovies: Movie[] = [];
    try {
      session.startTransaction();
      for (const createMovieDto of createMovieDtos) {
        const movie = await this.createMovie(createMovieDto);
        createdMovies.push(movie);
      }
      await session.commitTransaction();
      return createdMovies;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}
