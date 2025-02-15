import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { MoviesRepository } from './movies.repository';
import { TicketsService } from '../tickets/tickets.service';
import { WatchHistoryService } from '../watchhistory/watchhistory.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { GetMoviesDto } from './dto/get-movies.dto';
import * as Exceptions from './movies.exceptions';
import { TimeSlot } from './movies.constants';

describe('MoviesService', () => {
  let service: MoviesService;
  let moviesRepository: MoviesRepository;
  let ticketsService: TicketsService;
  let watchHistoryService: WatchHistoryService;

  const mockMoviesRepository = {
    create: jest.fn(),
    getAvailableMovies: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findMovieAndSessionById: jest.fn(),
  };

  const mockTicketsService = {
    useTicket: jest.fn(),
  };

  const mockWatchHistoryService = {
    createWatchHistory: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: MoviesRepository,
          useValue: mockMoviesRepository,
        },
        {
          provide: TicketsService,
          useValue: mockTicketsService,
        },
        {
          provide: WatchHistoryService,
          useValue: mockWatchHistoryService,
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    moviesRepository = module.get<MoviesRepository>(MoviesRepository);
    ticketsService = module.get<TicketsService>(TicketsService);
    watchHistoryService = module.get<WatchHistoryService>(WatchHistoryService);

    jest.clearAllMocks();
  });

  describe('createMovie', () => {
    const createMovieDto: CreateMovieDto = {
      name: 'Test Movie',
      ageRestriction: 18,
      sessions: [
        {
          "date": new Date("2024-03-20"),
          "timeSlot": TimeSlot.SLOT_14_16,
          "roomNumber": 1
        },
      ],
    };

    it('should create a movie with formatted sessions', async () => {
      const expectedMovie = {
        ...createMovieDto,
        sessions: [
          {
            startDate: new Date('2024-03-20T14:00:00.000Z'),
            endDate: new Date('2024-03-20T16:00:00.000Z'),
          },
        ],
      };

      mockMoviesRepository.create.mockResolvedValue(expectedMovie);

      const result = await service.createMovie(createMovieDto);

      expect(result).toEqual(expectedMovie);
      expect(mockMoviesRepository.create).toHaveBeenCalled();
    });
  });

  describe('getAvailableMovies', () => {
    const mockUser = {
      age: 20,
    };

    const getMoviesDto: GetMoviesDto = {
      page: 1,
      limit: 10,
    };

    it('should return available movies', async () => {
      const mockMovies = [
        { name: 'Movie 1' },
        { name: 'Movie 2' },
      ];

      mockMoviesRepository.getAvailableMovies.mockResolvedValue(mockMovies);

      const result = await service.getAvailableMovies(getMoviesDto, mockUser as any);

      expect(result).toEqual(mockMovies);
      expect(mockMoviesRepository.getAvailableMovies).toHaveBeenCalledWith({
        skip: 0,
        limit: 10,
        currentTime: expect.any(Date),
        userAge: 20,
      });
    });
  });

  describe('getMovieById', () => {
    it('should return a movie by id', async () => {
      const mockMovie = { id: '1', title: 'Test Movie' };
      mockMoviesRepository.findById.mockResolvedValue(mockMovie);

      const result = await service.getMovieById('1');

      expect(result).toEqual(mockMovie);
    });

    it('should throw MovieNotFound when movie does not exist', async () => {
      mockMoviesRepository.findById.mockResolvedValue(null);

      await expect(service.getMovieById('1')).rejects.toThrow(Exceptions.MovieNotFound());
    });
  });

  describe('watchMovie', () => {
    const mockUser = {
      _id: 'user1',
    };

    const mockMovie = {
      _id: 'movie1',
      title: 'Test Movie',
      sessions: [
        {
          _id: 'session1',
          startDate: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
          endDate: new Date(Date.now() + 120 * 60 * 1000),  // 2 hours from now
        },
      ],
    };

    const watchMovieDto = {
      ticketId: 'ticket1',
    };

    it('should successfully watch a movie', async () => {
      mockMoviesRepository.findMovieAndSessionById.mockResolvedValue(mockMovie);
      
      const mockTicket = { id: 'ticket1' };
      mockTicketsService.useTicket.mockResolvedValue(mockTicket);
      
      const mockWatchHistory = { id: 'history1' };
      mockWatchHistoryService.createWatchHistory.mockResolvedValue(mockWatchHistory);

      const result = await service.watchMovie({
        movieId: 'movie1',
        movieSessionId: 'session1',
        watchMovieDto,
        user: mockUser as any,
      });

      expect(result).toEqual({
        message: 'success',
        watchHistory: mockWatchHistory,
        ticket: mockTicket,
      });
    });

    it('should throw MovieSessionNotFound when session does not exist', async () => {
      mockMoviesRepository.findMovieAndSessionById.mockResolvedValue({
        ...mockMovie,
        sessions: [],
      });

      await expect(service.watchMovie({
        movieId: 'movie1',
        movieSessionId: 'session1',
        watchMovieDto,
        user: mockUser as any,
      })).rejects.toThrow(Exceptions.MovieSessionNotFound());
    });

    it('should throw MovieSessionExpired when session has ended', async () => {
      const expiredSession = {
        ...mockMovie,
        sessions: [{
          _id: 'session1',
          startDate: new Date(Date.now() - 3 * 60 * 60 * 1000),
          endDate: new Date(Date.now() - 1 * 60 * 60 * 1000),
        }],
      };

      mockMoviesRepository.findMovieAndSessionById.mockResolvedValue(expiredSession);

      await expect(service.watchMovie({
        movieId: 'movie1',
        movieSessionId: 'session1',
        watchMovieDto,
        user: mockUser as any,
      })).rejects.toThrow(Exceptions.MovieSessionExpired());
    });

    it('should throw MovieSessionStartsInMoreThanOneHour when start time is too far', async () => {
      const futureSession = {
        ...mockMovie,
        sessions: [{
          _id: 'session1',
          startDate: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
          endDate: new Date(Date.now() + 4 * 60 * 60 * 1000),
        }],
      };

      mockMoviesRepository.findMovieAndSessionById.mockResolvedValue(futureSession);

      await expect(service.watchMovie({
        movieId: 'movie1',
        movieSessionId: 'session1',
        watchMovieDto,
        user: mockUser as any,
      })).rejects.toThrow(Exceptions.MovieSessionStartsInMoreThanOneHour());
    });
  });

  describe('validateMovieSession', () => {
    it('should validate a valid movie session', () => {
      const validSession = {
        startDate: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
        endDate: new Date(Date.now() + 120 * 60 * 1000),  // 2 hours from now
      };

      expect(() => service.validateMovieSession(validSession as any)).not.toThrow();
    });

    it('should throw for expired session', () => {
      const expiredSession = {
        startDate: new Date(Date.now() - 3 * 60 * 60 * 1000),
        endDate: new Date(Date.now() - 1 * 60 * 60 * 1000),
      };

      expect(() => service.validateMovieSession(expiredSession as any))
        .toThrow(Exceptions.MovieSessionExpired());
    });

    it('should throw for session starting too far in future', () => {
      const futureSession = {
        startDate: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
        endDate: new Date(Date.now() + 4 * 60 * 60 * 1000),
      };

      expect(() => service.validateMovieSession(futureSession as any))
        .toThrow(Exceptions.MovieSessionStartsInMoreThanOneHour());
    });
  });
});
