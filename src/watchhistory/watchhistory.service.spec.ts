import { Test, TestingModule } from '@nestjs/testing';
import { WatchhistoryService } from './watchhistory.service';

describe('WatchhistoryService', () => {
  let service: WatchhistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WatchhistoryService],
    }).compile();

    service = module.get<WatchhistoryService>(WatchhistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
