import { Test, TestingModule } from '@nestjs/testing';
import { AverageController } from './average.controller';

describe('Average Controller', () => {
  let controller: AverageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AverageController],
    }).compile();

    controller = module.get<AverageController>(AverageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
