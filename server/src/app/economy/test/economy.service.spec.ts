import { Test, TestingModule } from '@nestjs/testing';
import { EconomyService } from '../economy.service';
import { EconomyRepository } from '../economy.repository';
import { BadRequestException, ConflictException } from '@nestjs/common';

describe('EconomyService', () => {
  let service: EconomyService;
  let repository: EconomyRepository;

  const mockRepository = {
    findTransactionBySessionId: jest.fn(),
    createTransactionAndAwardCredits: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EconomyService,
        { provide: EconomyRepository, useValue: mockRepository }, 
      ],
    }).compile();

    service = module.get<EconomyService>(EconomyService);
    repository = module.get<EconomyRepository>(EconomyRepository);
    
    jest.clearAllMocks();
  });

  it('should throw ConflictException if transaction already exists', async () => {
    mockRepository.findTransactionBySessionId.mockResolvedValue({ id: 'exists' });
    
    const dto = { gameSessionId: '123', score: 10, victory: true };
    await expect(service.processGameReward('user-1', dto))
      .rejects
      .toThrow(ConflictException);
  });

  it('should throw BadRequestException if reward is too high', async () => {
    const dto = { gameSessionId: '123', score: 10000, victory: true }; 
    await expect(service.processGameReward('user-1', dto))
      .rejects
      .toThrow(BadRequestException);
  });

  it('should successfully process and award credits', async () => {
    const dto = { gameSessionId: 'session-123', score: 100, victory: true };
    const userId = 'user-123';
    
    mockRepository.findTransactionBySessionId.mockResolvedValue(null);
    mockRepository.createTransactionAndAwardCredits.mockResolvedValue({ 
      transactionId: 'tx-456', 
      balance: 110 
    });

    const result = await service.processGameReward(userId, dto) as any;

    expect(result.status).toBe('success');
    expect(result.balance).toBe(110);
    expect(mockRepository.createTransactionAndAwardCredits).toHaveBeenCalled();
  });
});