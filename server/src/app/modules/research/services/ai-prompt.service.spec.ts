import { Test, TestingModule } from '@nestjs/testing';
import { AiPromptService } from './ai-prompt.service';
import { AiPromptRepository } from '../repositories/ai-prompt.repository';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';

describe('AiPromptService', () => {
  let service: AiPromptService;
  let repository: AiPromptRepository;
  let cacheManager: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiPromptService,
        {
          provide: AiPromptRepository,
          useValue: {
            findActivePrompt: jest.fn(),
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue(600),
          },
        },
      ],
    }).compile();

    service = module.get<AiPromptService>(AiPromptService);
    repository = module.get<AiPromptRepository>(AiPromptRepository);
    cacheManager = module.get(CACHE_MANAGER);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPrompt', () => {
    it('should return cached prompt if available', async () => {
      cacheManager.get.mockResolvedValue('Cached prompt');
      const result = await service.getPrompt('test', 'CAT');
      expect(result).toBe('Cached prompt');
      expect(repository.findActivePrompt).not.toHaveBeenCalled();
    });

    it('should fetch from DB and cache if not in cache', async () => {
      cacheManager.get.mockResolvedValue(null);
      repository.findActivePrompt = jest.fn().mockResolvedValue({ content: 'DB prompt' });
      
      const result = await service.getPrompt('test', 'CAT');
      
      expect(result).toBe('DB prompt');
      expect(repository.findActivePrompt).toHaveBeenCalledWith('test', 'CAT');
      expect(cacheManager.set).toHaveBeenCalledWith('prompt:test:CAT', 'DB prompt', 600000);
    });

    it('should return default fallback if DB returns null and default is provided', async () => {
      cacheManager.get.mockResolvedValue(null);
      repository.findActivePrompt = jest.fn().mockResolvedValue(null);
      
      const result = await service.getPrompt('test', 'CAT', 'Fallback prompt');
      
      expect(result).toBe('Fallback prompt');
    });
  });
});
