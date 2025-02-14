import { Injectable } from "@nestjs/common";
import { TicketsRepository } from "./tickets.repository";
import { BuyTicketDto } from "./dto/buy-ticket.dto";
import { Tickets } from "./ticket.schema";
import { User, UserDocument } from "src/users/users.schema";
import { MoviesService } from "src/movies/movies.service";
import mongoose from "mongoose";
@Injectable()
export class TicketsService {
  constructor(
    private readonly ticketsRepository: TicketsRepository,
    private readonly moviesService: MoviesService
  ) {}

  async buyTicket(
    buyTicketDto: BuyTicketDto,
    user: UserDocument
  ): Promise<Tickets> {
    const { movieId, movieSessionId, seatNumber, price } = buyTicketDto;
    const { movie, movieSession } =
      await this.moviesService.getMovieAndSessionById(movieId, movieSessionId);

    return this.ticketsRepository.create({
      movieId: movie._id,
      movieSessionId: movieSession?._id,
      seatNumber,
      price,
      userId: user._id,
      isUsed: false,
    });
  }
}
