import { Test, TestingModule } from '@nestjs/testing';
import { WatchHistoryService } from './watchhistory.service';
import { WatchHistoryRepository } from './watchhistory.repository';
import { RedisService } from '../redis/redis.service';
import { Types } from 'mongoose';

describe('WatchHistoryService', () => {
  let service: WatchHistoryService;
  let watchHistoryRepository: jest.Mocked<WatchHistoryRepository>;
  let redisService: jest.Mocked<RedisService>;

  const mockUser = {
    _id: new Types.ObjectId(),
  };

  const mockWatchHistory = {
    _id: new Types.ObjectId(),
    movieId: new Types.ObjectId().toString(),
    movieSessionId: new Types.ObjectId().toString(),
    userId: mockUser._id.toString(),
    ticketId: new Types.ObjectId().toString(),
    watchDate: new Date(),
  };

  beforeEach(async () => {
    watchHistoryRepository = {
      create: jest.fn(),
      findByUserId: jest.fn(),
    } as any;

    redisService = {
      get: jest.fn(),
      set: jest.fn(),
      setWithTtl: jest.fn(),
      delete: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WatchHistoryService,
        {
          provide: WatchHistoryRepository,
          useValue: watchHistoryRepository,
        },
        {
          provide: RedisService,
          useValue: redisService,
        },
      ],
    }).compile();

    service = module.get<WatchHistoryService>(WatchHistoryService);
  });

  describe('createWatchHistory', () => {
    it('should create watch history successfully', async () => {
      const mockWatchHistoryDoc = {
        ...mockWatchHistory,
        save: jest.fn(),
      } as any;
      
      watchHistoryRepository.create.mockResolvedValue(mockWatchHistoryDoc);

      const result = await service.createWatchHistory({
        movieId: mockWatchHistory.movieId,
        movieSessionId: mockWatchHistory.movieSessionId,
        userId: mockWatchHistory.userId,
        ticketId: mockWatchHistory.ticketId,
      });

      expect(result).toEqual(mockWatchHistoryDoc);
      expect(watchHistoryRepository.create).toHaveBeenCalledWith({
        movieId: mockWatchHistory.movieId,
        movieSessionId: mockWatchHistory.movieSessionId,
        userId: mockWatchHistory.userId,
        ticketId: mockWatchHistory.ticketId,
        watchDate: expect.any(Date),
      });
    });
  });

  describe('getWatchHistory', () => {
    it('should get watch history from cache', async () => {
      const cachedHistory = [{
        ...mockWatchHistory,
        _id: mockWatchHistory._id.toString(),
        watchDate: mockWatchHistory.watchDate.toISOString(),
      }];
      redisService.get.mockResolvedValue(JSON.stringify(cachedHistory));

      const result = await service.getWatchHistory(mockUser as any);

      expect(result).toEqual(cachedHistory);
      expect(redisService.get).toHaveBeenCalledWith(`watchhistory:${mockUser._id}`);
      expect(watchHistoryRepository.findByUserId).not.toHaveBeenCalled();
    });

    it('should get watch history from database', async () => {
      redisService.get.mockResolvedValue(null);
      const dbHistory = [mockWatchHistory];
      watchHistoryRepository.findByUserId.mockResolvedValue(dbHistory as any);

      const result = await service.getWatchHistory(mockUser as any);

      expect(result).toEqual(dbHistory);
      expect(watchHistoryRepository.findByUserId).toHaveBeenCalledWith(mockUser._id.toString());
      expect(redisService.setWithTtl).toHaveBeenCalledWith(
        `watchhistory:${mockUser._id}`,
        JSON.stringify(dbHistory),
        3600
      );
    });

    it('if user id is not found, query with empty string', async () => {
      const userWithoutId = { email: 'test@test.com' };
      await service.getWatchHistory(userWithoutId as any);

      expect(watchHistoryRepository.findByUserId).toHaveBeenCalledWith('');
    });
  });

  describe('deleteWatchHistoryFromCache', () => {
    it('should delete watch history from cache', async () => {
      const userId = mockUser._id.toString();
      await service.deleteWatchHistoryFromCache(userId);

      expect(redisService.delete).toHaveBeenCalledWith(`watchhistory:${userId}`);
    });
  });
});
