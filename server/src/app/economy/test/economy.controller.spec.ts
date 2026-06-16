import { Test, TestingModule } from '@nestjs/testing';
import { EconomyController } from '../economy.controller';
import { EconomyService } from '../economy.service';
import { ClaimRewardDto } from '../dto/claim.reward.dto';
import { PurchaseDto } from '../dto/purchase.dto';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';

describe('EconomyController', () => {
  let controller: EconomyController;
  let service: EconomyService;

  const mockService = {
    processGameReward: jest.fn(),
    getBalance: jest.fn(),
    processPurchase: jest.fn(), // Agregado para soportar los tests de purchase
  };

  const userId = 'user-uuid-1234';
  const purchaseDto: PurchaseDto = { itemId: 'item-uuid-5678' };

  const successPurchaseResponse = {
    status: 'success' as const,
    purchaseId: 'purchase-uuid-9999',
    itemId: purchaseDto.itemId,
    itemName: 'Dragon Avatar',
    itemType: 'avatar',
    creditsSpent: 200,
    newBalance: 300,
    processedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EconomyController],
      providers: [
        { provide: EconomyService, useValue: mockService },
      ],
    }).compile();

    controller = module.get<EconomyController>(EconomyController);
    service = module.get<EconomyService>(EconomyService);
    jest.clearAllMocks();
  });

  // ─── POST /economy/claim-reward ────────────────────────────────────────────
  describe('POST /economy/claim-reward', () => {
    it('should return 200 with valid JWT and DTO', async () => {
      const dto: ClaimRewardDto = {
        gameSessionId: '550e8400-e29b-41d4-a716-446655440001',
        score: 150,
        victory: true,
      };

      mockService.processGameReward.mockResolvedValue({
        status: 'success',
        transactionId: 'tx-1',
        balance: { credits: 115, experience_points: 57 },
      });

      const result = await controller.claimReward('user-1', dto);

      expect(result.status).toBe('success');
      expect(service.processGameReward).toHaveBeenCalledWith('user-1', dto);
    });

    it('should return 409 on duplicate gameSessionId (idempotency)', async () => {
      const dto: ClaimRewardDto = {
        gameSessionId: '550e8400-e29b-41d4-a716-446655440001',
        score: 150,
        victory: true,
      };

      mockService.processGameReward.mockRejectedValue(
        new ConflictException('Reward already claimed for session')
      );

      await expect(controller.claimReward('user-1', dto))
        .rejects.toThrow(ConflictException);
    });

    it('should return 400 if reward exceeds threshold (security limit)', async () => {
      const dto: ClaimRewardDto = {
        gameSessionId: '550e8400-e29b-41d4-a716-446655440001',
        score: 4010,
        victory: true,
      };

      mockService.processGameReward.mockRejectedValue(
        new BadRequestException('Reward exceeds allowed limits')
      );

      await expect(controller.claimReward('user-1', dto))
        .rejects.toThrow(BadRequestException);
    });

    it('should return 200 for participation (loss)', async () => {
      const dto: ClaimRewardDto = {
        gameSessionId: '550e8400-e29b-41d4-a716-446655440002',
        score: 50,
        victory: false,
      };

      mockService.processGameReward.mockResolvedValue({
        status: 'success',
        transactionId: 'tx-2',
        balance: { credits: 25, experience_points: 10 },
      });

      const result = await controller.claimReward('user-2', dto);

      expect(result.status).toBe('success');
    });

    it('should call service with correct userId and DTO', async () => {
      const dto: ClaimRewardDto = {
        gameSessionId: '550e8400-e29b-41d4-a716-446655440003',
        score: 100,
        victory: true,
      };

      mockService.processGameReward.mockResolvedValue({
        status: 'success',
        transactionId: 'tx-3',
        balance: { credits: 110, experience_points: 55 },
      });

      await controller.claimReward('user-abc', dto);

      expect(service.processGameReward).toHaveBeenCalledWith('user-abc', dto);
    });
  });

  // ─── GET /economy/balance ──────────────────────────────────────────────────
  describe('GET /economy/balance', () => {
    it('should return balance for authenticated user', async () => {
      mockService.getBalance.mockResolvedValue({
        credits: 215,
        experience_points: 1057,
      });

      const result = await controller.getBalance('user-1');

      expect(result).toEqual({ credits: 215, experience_points: 1057 });
      expect(service.getBalance).toHaveBeenCalledWith('user-1');
    });

    it('should propagate NotFoundException for unknown user', async () => {
      mockService.getBalance.mockRejectedValue(
        new NotFoundException('User not found')
      );

      await expect(controller.getBalance('ghost-user'))
        .rejects.toThrow(NotFoundException);
    });
  });

  // ─── POST /economy/purchase (Agregado al final) ────────────────────────────
  describe('POST /economy/purchase', () => {
    it('should return PurchaseResponseDto with status "success" on valid purchase', async () => {
      mockService.processPurchase.mockResolvedValue(successPurchaseResponse);

      const result = await controller.purchase(userId, purchaseDto);

      expect(result.status).toBe('success');
      expect(result.purchaseId).toBe('purchase-uuid-9999');
      expect(result.newBalance).toBe(300);
      expect(result.creditsSpent).toBe(200);
    });

    it('should delegate to EconomyService.processPurchase with correct userId and dto', async () => {
      mockService.processPurchase.mockResolvedValue(successPurchaseResponse);

      await controller.purchase(userId, purchaseDto);

      expect(service.processPurchase).toHaveBeenCalledTimes(1);
      expect(service.processPurchase).toHaveBeenCalledWith(userId, purchaseDto);
    });

    it('should return itemId and itemType from the service response', async () => {
      mockService.processPurchase.mockResolvedValue(successPurchaseResponse);

      const result = await controller.purchase(userId, purchaseDto);

      expect(result.itemId).toBe(purchaseDto.itemId);
      expect(result.itemType).toBe('avatar');
      expect(result.itemName).toBe('Dragon Avatar');
    });

    it('should propagate NotFoundException when item does not exist', async () => {
      mockService.processPurchase.mockRejectedValue(
        new NotFoundException(`Item ${purchaseDto.itemId} not found or not available`),
      );

      await expect(controller.purchase(userId, purchaseDto)).rejects.toThrow(NotFoundException);
    });

    it('should propagate BadRequestException when user has insufficient funds', async () => {
      mockService.processPurchase.mockRejectedValue(
        new BadRequestException('Insufficient funds: need 200 credits, have 50'),
      );

      await expect(controller.purchase(userId, purchaseDto)).rejects.toThrow(BadRequestException);
    });

    it('should propagate ConflictException when user already owns the item', async () => {
      mockService.processPurchase.mockRejectedValue(
        new ConflictException('User already owns this item'),
      );

      await expect(controller.purchase(userId, purchaseDto)).rejects.toThrow(ConflictException);
    });

    it('should propagate ConflictException on DB-level race condition (P2002)', async () => {
      mockService.processPurchase.mockRejectedValue(
        new ConflictException('User already owns this item'),
      );

      await expect(controller.purchase(userId, purchaseDto)).rejects.toThrow(ConflictException);
      expect(service.processPurchase).toHaveBeenCalledTimes(1);
    });

    it('should NOT call processGameReward or getBalance during a purchase', async () => {
      mockService.processPurchase.mockResolvedValue(successPurchaseResponse);

      await controller.purchase(userId, purchaseDto);

      expect(service.processGameReward).not.toHaveBeenCalled();
      expect(service.getBalance).not.toHaveBeenCalled();
    });

    it('should call processPurchase exactly once per request', async () => {
      mockService.processPurchase.mockResolvedValue(successPurchaseResponse);

      await controller.purchase(userId, purchaseDto);

      expect(service.processPurchase).toHaveBeenCalledTimes(1);
    });
  });
});