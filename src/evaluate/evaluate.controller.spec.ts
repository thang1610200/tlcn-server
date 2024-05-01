import { Test, TestingModule } from '@nestjs/testing';
import { EvaluateController } from './evaluate.controller';

describe('EvaluateController', () => {
  let controller: EvaluateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EvaluateController],
    }).compile();

    controller = module.get<EvaluateController>(EvaluateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
