import { Test, TestingModule } from '@nestjs/testing';
import { PurerideBatchController } from './pureride-batch.controller';
import { PurerideBatchService } from './pureride-batch.service';

describe('PurerideBatchController', () => {
  let purerideBatchController: PurerideBatchController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PurerideBatchController],
      providers: [PurerideBatchService],
    }).compile();

    purerideBatchController = app.get<PurerideBatchController>(PurerideBatchController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(purerideBatchController.getHello()).toBe('Hello World!');
    });
  });
});
