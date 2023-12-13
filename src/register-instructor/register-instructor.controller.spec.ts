import { Test, TestingModule } from '@nestjs/testing';
import { RegisterInstructorController } from './register-instructor.controller';

describe('RegisterInstructorController', () => {
  let controller: RegisterInstructorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegisterInstructorController],
    }).compile();

    controller = module.get<RegisterInstructorController>(RegisterInstructorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
