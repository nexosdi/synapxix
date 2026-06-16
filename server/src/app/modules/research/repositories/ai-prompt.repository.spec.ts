import { Test, TestingModule } from '@nestjs/testing';
import { AiPromptRepository } from './ai-prompt.repository';
import { PrismaService } from '@nexosdi.synapxix/prisma';

describe('AiPromptRepository', () => {
  let repository: AiPromptRepository;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiPromptRepository,
        {
          provide: PrismaService,
          useValue: {
            aiPrompt: {
              findFirst: jest.fn(),
              create: jest.fn(),
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    repository = module.get<AiPromptRepository>(AiPromptRepository);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findActivePrompt', () => {
    it('should find the active prompt with highest version', async () => {
      const expectedQuery = {
        where: {
          game_type: 'read-aloud',
          category: 'SYSTEM_ANALYSIS',
          is_active: true,
        },
        orderBy: {
          version: 'desc',
        },
      };

      await repository.findActivePrompt('read-aloud', 'SYSTEM_ANALYSIS');
      expect(prismaService.aiPrompt.findFirst).toHaveBeenCalledWith(expectedQuery);
    });
  });

  describe('createPrompt', () => {
    it('should create a new prompt', async () => {
      const dto = {
        gameType: 'test',
        category: 'TEST_CAT',
        name: 'Test Name',
        content: 'Test content',
      };

      await repository.createPrompt(dto);
      expect(prismaService.aiPrompt.create).toHaveBeenCalledWith({
        data: {
          game_type: 'test',
          category: 'TEST_CAT',
          name: 'Test Name',
          content: 'Test content',
          version: 1,
        },
      });
    });
  });
});
