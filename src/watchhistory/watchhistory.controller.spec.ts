import { Test, TestingModule } from '@nestjs/testing';
import { WatchhistoryController } from './watchhistory.controller';
import { WatchHistoryService } from './watchhistory.service';
import { WatchHistoryRepository } from './watchhistory.repository';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

describe('WatchhistoryController', () => {
  let controller: WatchhistoryController;
  let watchHistoryService: WatchHistoryService;
  let watchHistoryRepository: jest.Mocked<WatchHistoryRepository>;

  beforeEach(async () => {
    watchHistoryRepository = {
      create: jest.fn(),
      findByUserId: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [WatchhistoryController],
      providers: [
        WatchHistoryService,
        {
          provide: WatchHistoryRepository,
          useValue: watchHistoryRepository,
        },
        {
          provide: JwtService,
          useValue: {
            verify: jest.fn(),
            sign: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<WatchhistoryController>(WatchhistoryController);
    watchHistoryService = module.get<WatchHistoryService>(WatchHistoryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
