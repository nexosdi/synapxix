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
    reinforceTopic: jest.fn(),
    setPreferences: jest.fn(),
    initMethod: jest.fn(),
    reinforceMethod: jest.fn(),
    topTopics: jest.fn(),
    topPreferences: jest.fn(),
    topMethods: jest.fn(),
    refreshUserEmbedding: jest.fn(),
  };

  // Mock of the payload extracted by JwtAuthGuard
  const mockRequest = { user: { id: 'user-token-123' } } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LearningController],
      providers: [{ provide: LearningService, useValue: mockLearningService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })//bypass
      .compile();

    controller = module.get<LearningController>(LearningController);
    service = module.get<LearningService>(LearningService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('bootstrap: should call bootstrapSchema', async () => {
    await controller.bootstrap();
    expect(service.bootstrapSchema).toHaveBeenCalled();
  });

  it('createUser: should inject the token ID', async () => {
    await controller.createUser(mockRequest, { name: 'Fernando' } as any);
    expect(service.createUser).toHaveBeenCalledWith(expect.objectContaining({ userId: 'user-token-123', name: 'Fernando' }));
  });

  it('createTopic: should inject the token ID', async () => {
    await controller.createTopic(mockRequest, { topicId: 'T1' } as any);
    expect(service.createTopic).toHaveBeenCalledWith(expect.objectContaining({ userId: 'user-token-123' }));
  });

  it('feedbackTopic: should inject the token ID', async () => {
    await controller.feedbackTopic(mockRequest, { topicId: 'T1', delta: 1 } as any);
    expect(service.reinforceTopic).toHaveBeenCalledWith(expect.objectContaining({ userId: 'user-token-123' }));
  });

  it('setPreferences: should inject the token ID', async () => {
    await controller.setPreferences(mockRequest, { prefKeys: ['visual'] } as any);
    expect(service.setPreferences).toHaveBeenCalledWith(expect.objectContaining({ userId: 'user-token-123' }));
  });

  it('initMethod: should inject the token ID', async () => {
    await controller.initMethod(mockRequest, { methodKey: 'M1' } as any);
    expect(service.initMethod).toHaveBeenCalledWith(expect.objectContaining({ userId: 'user-token-123' }));
  });

  it('feedbackMethod: should inject the token ID', async () => {
    await controller.feedbackMethod(mockRequest, { methodKey: 'M1', delta: 1 } as any);
    expect(service.reinforceMethod).toHaveBeenCalledWith(expect.objectContaining({ userId: 'user-token-123' }));
  });

  it('topTopics: should use the token userId and parse the limit', async () => {
    await controller.topTopics(mockRequest, '5');
    expect(service.topTopics).toHaveBeenCalledWith('user-token-123', 5);
  });

  it('topPreferences: should use the token userId and parse the limit', async () => {
    await controller.topPreferences(mockRequest, '15');
    expect(service.topPreferences).toHaveBeenCalledWith('user-token-123', 15);
  });

  it('topMethods: should use the token userId and parse the limit', async () => {
    await controller.topMethods(mockRequest, '5');
    expect(service.topMethods).toHaveBeenCalledWith('user-token-123', 5);
  });

  it('refreshEmbedding: should use the token userId', async () => {
    await controller.refreshEmbedding(mockRequest);
    expect(service.refreshUserEmbedding).toHaveBeenCalledWith('user-token-123');
  });
});