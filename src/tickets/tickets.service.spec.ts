import { Test, TestingModule } from '@nestjs/testing';
import { TicketsService } from './tickets.service';
import { TicketsRepository } from './tickets.repository';
import { MoviesService } from 'src/movies/movies.service';
import { Types } from 'mongoose';
import * as Exceptions from './tickets.exceptions';

describe('TicketsService', () => {
  let service: TicketsService;
  let ticketsRepository: jest.Mocked<TicketsRepository>;
  let moviesService: jest.Mocked<MoviesService>;

  const mockTicket = {
    _id: new Types.ObjectId(),
    movieId: new Types.ObjectId(),
    movieSessionId: new Types.ObjectId(),
    seatNumber: 'A1',
    price: 100,
    userId: new Types.ObjectId(),
    isUsed: false,
  };

  const mockUser = {
    _id: mockTicket.userId,
  };

  const mockMovie = {
    _id: mockTicket.movieId,
  };

  const mockMovieSession = {
    _id: mockTicket.movieSessionId,
  };

  beforeEach(async () => {
    ticketsRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      useTicket: jest.fn(),
    } as any;

    moviesService = {
      getMovieAndSessionById: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketsService,
        {
          provide: TicketsRepository,
          useValue: ticketsRepository,
        },
        {
          provide: MoviesService,
          useValue: moviesService,
        },
      ],
    }).compile();

    service = module.get<TicketsService>(TicketsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('buyTicket', () => {
    it('başarılı bir şekilde bilet satın almalı', async () => {
      moviesService.getMovieAndSessionById.mockResolvedValue({
        movie: mockMovie,
        movieSession: mockMovieSession,
      });
      ticketsRepository.create.mockResolvedValue(mockTicket);

      const result = await service.buyTicket(
        {
          movieId: mockMovie._id.toString(),
          movieSessionId: mockMovieSession._id.toString(),
          seatNumber: 'A1',
          price: 100,
        },
        mockUser as any
      );

      expect(result).toEqual(mockTicket);
    });
  });

  describe('validateTicket', () => {
    it('geçerli bir bileti doğrulamalı', () => {
      const result = service.validateTicket({
        ticket: mockTicket,
        userId: mockTicket.userId.toString(),
        movieId: mockTicket.movieId.toString(),
        movieSessionId: mockTicket.movieSessionId.toString(),
      });

      expect(result).toBe(true);
    });

    it('kullanılmış bilet için hata fırlatmalı', () => {
      const usedTicket = { ...mockTicket, isUsed: true };

      expect(() =>
        service.validateTicket({
          ticket: usedTicket,
          userId: mockTicket.userId.toString(),
          movieId: mockTicket.movieId.toString(),
          movieSessionId: mockTicket.movieSessionId.toString(),
        })
      ).toThrow(Exceptions.TicketAlreadyUsed());
    });

    it('yanlış kullanıcı için hata fırlatmalı', () => {
      expect(() =>
        service.validateTicket({
          ticket: mockTicket,
          userId: new Types.ObjectId().toString(),
          movieId: mockTicket.movieId.toString(),
          movieSessionId: mockTicket.movieSessionId.toString(),
        })
      ).toThrow(Exceptions.TicketIsNotValidForUser());
    });
  });

  describe('useTicket', () => {
    it('başarılı bir şekilde bileti kullanmalı', async () => {
      ticketsRepository.findById.mockResolvedValue(mockTicket);
      ticketsRepository.useTicket.mockResolvedValue({ ...mockTicket, isUsed: true });

      const result = await service.useTicket({
        movieId: mockTicket.movieId.toString(),
        movieSessionId: mockTicket.movieSessionId.toString(),
        ticketId: mockTicket._id.toString(),
        userId: mockTicket.userId.toString(),
      });

      expect(result.isUsed).toBe(true);
    });

    it('var olmayan bilet için hata fırlatmalı', async () => {
      ticketsRepository.findById.mockResolvedValue(null);

      await expect(
        service.useTicket({
          movieId: mockTicket.movieId.toString(),
          movieSessionId: mockTicket.movieSessionId.toString(),
          ticketId: mockTicket._id.toString(),
          userId: mockTicket.userId.toString(),
        })
      ).rejects.toThrow(Exceptions.TicketNotFound());
    });
  });
});
