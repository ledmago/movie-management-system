import { Test, TestingModule } from '@nestjs/testing';
import { WatchhistoryController } from './watchhistory.controller';

describe('WatchhistoryController', () => {
  let controller: WatchhistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WatchhistoryController],
    }).compile();

    controller = module.get<WatchhistoryController>(WatchhistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
