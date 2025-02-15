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
    name: 'Test Movie',
    ageRestriction: 13,
    sessions: [
      {
        _id: new Types.ObjectId(),
        startDate: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
        endDate: new Date(Date.now() + 120 * 60 * 1000),  // 2 hours from now
        roomNumber: 1,
      },
    ],

  };

  const mockMovieSession = {
    _id: mockTicket.movieSessionId,
  };

  beforeEach(async () => {
    ticketsRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      useTicket: jest.fn(),
      findByMovieSessionIdAndSeatNumber: jest.fn(),
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
    it('should buy ticket sucessfully', async () => {
      ticketsRepository.findByMovieSessionIdAndSeatNumber.mockResolvedValue(null);
      moviesService.getMovieAndSessionById.mockResolvedValue({
        movie: mockMovie as any,
        movieSession: mockMovie.sessions[0] as any
      });
      ticketsRepository.create.mockResolvedValue(mockTicket as any);

      const result = await service.buyTicket(
        {
          movieId: mockMovie._id.toString(),
          movieSessionId: mockMovieSession._id.toString(),
          seatNumber: 2,
          price: 100,
        },
        mockUser as any
      );

      expect(result).toEqual(mockTicket);
    });
  });

  describe('validateTicket', () => {
    it('should validate a valid ticket', () => {
      const result = service.validateTicket({
        ticket: mockTicket as any,
        userId: mockTicket.userId.toString(),
        movieId: mockTicket.movieId.toString(),
        movieSessionId: mockTicket.movieSessionId.toString(),
      });

      expect(result).toBe(true);
    });

    it('If used ticket, throw an error', () => {
      const usedTicket = { ...mockTicket, isUsed: true };

      expect(() =>
        service.validateTicket({
          ticket: usedTicket as any,
          userId: mockTicket.userId.toString(),
          movieId: mockTicket.movieId.toString(),
          movieSessionId: mockTicket.movieSessionId.toString(),
        })
      ).toThrow(Exceptions.TicketAlreadyUsed());
    });

    it('If ticket is belongs to another user, throw an error', () => {
      expect(() =>
        service.validateTicket({
          ticket: mockTicket as any,
          userId: new Types.ObjectId().toString(),
          movieId: mockTicket.movieId.toString(),
          movieSessionId: mockTicket.movieSessionId.toString(),
        })
      ).toThrow(Exceptions.TicketIsNotValidForUser());
    });
  });

  describe('useTicket', () => {
    it('should use ticket successfully', async () => {
      ticketsRepository.findById.mockResolvedValue(mockTicket as any);
      ticketsRepository.useTicket.mockResolvedValue({ ...mockTicket, isUsed: true } as any);

      const result = await service.useTicket({
        movieId: mockTicket.movieId.toString(),
        movieSessionId: mockTicket.movieSessionId.toString(),
        ticketId: mockTicket._id.toString(),
        userId: mockTicket.userId.toString(),
      });

      expect(result?.isUsed).toBe(true);
    });

    it('should throw an error if ticket is not found', async () => {
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
