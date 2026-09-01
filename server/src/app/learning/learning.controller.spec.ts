import { Test, TestingModule } from '@nestjs/testing';
import { LearningController } from './learning.controller';
import { LearningService } from './learning.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; 

describe('LearningController', () => {
  let controller: LearningController;
  let service: LearningService;

  const mockLearningService = {
    bootstrapSchema: jest.fn(),
    createUser: jest.fn(),
    createTopic: jest.fn(),
    topTopics: jest.fn(),
  };

  const mockRequest = { user: { id: 'user-token-123' } };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LearningController],
      providers: [
        {
          provide: LearningService,
          useValue: mockLearningService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<LearningController>(LearningController);
    service = module.get<LearningService>(LearningService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('bootstrap', () => {
    it('debe llamar a bootstrapSchema', async () => {
      mockLearningService.bootstrapSchema.mockResolvedValue(true);
      await controller.bootstrap();
      expect(service.bootstrapSchema).toHaveBeenCalledTimes(1);
    });
  });

  describe('createUser', () => {
    it('debe inyectar el ID del token y llamar al servicio', async () => {
      const inputBody = { name: 'Prueba' }; 
      mockLearningService.createUser.mockResolvedValue(true);

      await controller.createUser(mockRequest, inputBody as any);

      expect(service.createUser).toHaveBeenCalledWith({
        userId: 'user-token-123',
        name: 'Prueba'
      });
    });
  });

  describe('createTopic', () => {
    it('debe inyectar el ID del token y llamar al servicio', async () => {
      const inputBody = { topicId: 'T1', topicContent: 'NestJS' };
      mockLearningService.createTopic.mockResolvedValue(true);

      await controller.createTopic(mockRequest, inputBody as any);

      expect(service.createTopic).toHaveBeenCalledWith({
        userId: 'user-token-123',
        topicId: 'T1',
        topicContent: 'NestJS'
      });
    });
  });

  describe('topTopics', () => {
    it('debe usar el userId del token', async () => {
      mockLearningService.topTopics.mockResolvedValue([]);
      
      await controller.topTopics(mockRequest, '5');

      expect(service.topTopics).toHaveBeenCalledWith('user-token-123', 5);
    });
  });
});