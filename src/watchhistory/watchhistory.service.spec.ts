import { Test, TestingModule } from '@nestjs/testing';
import { WatchHistoryService } from './watchhistory.service';
import { WatchHistoryRepository } from './watchhistory.repository';
import { Types } from 'mongoose';

describe('WatchHistoryService', () => {
  let service: WatchHistoryService;
  let watchHistoryRepository: jest.Mocked<WatchHistoryRepository>;

  const mockUser = {
    _id: new Types.ObjectId(),
    email: 'test@test.com',
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

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WatchHistoryService,
        {
          provide: WatchHistoryRepository,
          useValue: watchHistoryRepository,
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
    it('should get watch history successfully', async () => {
      const mockWatchHistoryList = [{
        ...mockWatchHistory,
        save: jest.fn(),
      }] as any;
      
      watchHistoryRepository.findByUserId.mockResolvedValue(mockWatchHistoryList);

      const result = await service.getWatchHistory(mockUser as any);

      expect(result).toEqual(mockWatchHistoryList);
      expect(watchHistoryRepository.findByUserId).toHaveBeenCalledWith(mockUser._id.toString());
    });

    it('if user id is not found, query with empty string', async () => {
      const userWithoutId = { email: 'test@test.com' };
      await service.getWatchHistory(userWithoutId as any);

      expect(watchHistoryRepository.findByUserId).toHaveBeenCalledWith('');
    });
  });
});
