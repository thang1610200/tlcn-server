import { Test, TestingModule } from '@nestjs/testing';
import { RegisterInstructorService } from './register-instructor.service';

describe('RegisterInstructorService', () => {
  let service: RegisterInstructorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RegisterInstructorService],
    }).compile();

    service = module.get<RegisterInstructorService>(RegisterInstructorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
