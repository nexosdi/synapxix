import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { EconomyService } from '../economy.service';
import { EconomyRepository } from '../economy.repository';

const makePrismaError = (code: string) =>
  new PrismaClientKnownRequestError('mock error', {
    code,
    clientVersion: '5.0.0',
  });

describe('EconomyService — Purchase Stress & Concurrency', () => {
  let service: EconomyService;

  const mockRepository = {
    findTransactionBySessionId: jest.fn(),
    createRewardTransaction: jest.fn(),
    getBalance: jest.fn(),
    findActiveStoreItem: jest.fn(),
    findUserInventoryItem: jest.fn(),
    createPurchaseTransaction: jest.fn(),
  };

  const mockItem = {
    store_item_id: 'item-uuid-0001',
    name: 'Cyber Banner',
    type: 'banner',
    price: 150,
    is_active: true,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EconomyService,
        { provide: EconomyRepository, useValue: mockRepository },
      ],
    }).compile();

    service = module.get<EconomyService>(EconomyService);
    jest.clearAllMocks();
  });

  describe('Concurrent Purchases — Same Item', () => {
    it('should allow only 1 of 10 concurrent purchases to succeed', async () => {
      let insertCount = 0;

      mockRepository.findActiveStoreItem.mockResolvedValue(mockItem);
      mockRepository.getBalance.mockResolvedValue({ credits: 500 });
      mockRepository.findUserInventoryItem.mockResolvedValue(null);
      mockRepository.createPurchaseTransaction.mockImplementation(() => {
        insertCount++;
        if (insertCount === 1) {
          return Promise.resolve({ purchaseId: 'p-1', inventoryId: 'i-1', newBalance: 350 });
        }
        return Promise.reject(makePrismaError('P2002'));
      });

      const promises = Array.from({ length: 10 }, () =>
        service
          .processPurchase('user-stress', { itemId: mockItem.store_item_id })
          .then(() => ({ success: true }))
          .catch((err) => {
            if (err instanceof ConflictException) return { success: false, reason: 'conflict' };
            throw err;
          }),
      );

      const results = await Promise.all(promises);

      const successCount = results.filter((r) => r.success).length;
      const conflictCount = results.filter(
        (r): r is { success: false; reason: 'conflict' } =>
          !r.success && 'reason' in r && r.reason === 'conflict',
      ).length;

      expect(successCount).toBe(1);
      expect(conflictCount).toBe(9);
      expect(mockRepository.createPurchaseTransaction).toHaveBeenCalledTimes(10);
    });

    it('should allow only 1 of 50 concurrent purchases to succeed', async () => {
      let insertCount = 0;

      mockRepository.findActiveStoreItem.mockResolvedValue(mockItem);
      mockRepository.getBalance.mockResolvedValue({ credits: 999 });
      mockRepository.findUserInventoryItem.mockResolvedValue(null);
      mockRepository.createPurchaseTransaction.mockImplementation(() => {
        insertCount++;
        if (insertCount === 1) {
          return Promise.resolve({ purchaseId: 'p-1', inventoryId: 'i-1', newBalance: 849 });
        }
        return Promise.reject(makePrismaError('P2002'));
      });

      const results = await Promise.allSettled(
        Array.from({ length: 50 }, () =>
          service.processPurchase('user-stress', { itemId: mockItem.store_item_id }),
        ),
      );

      expect(results.filter((r) => r.status === 'fulfilled')).toHaveLength(1);
      expect(results.filter((r) => r.status === 'rejected')).toHaveLength(49);
    });
  });

  describe('Burst — Different Items and Users', () => {
    it('should handle 100 purchase requests for different items without errors', async () => {
      mockRepository.findActiveStoreItem.mockResolvedValue(mockItem);
      mockRepository.getBalance.mockResolvedValue({ credits: 9999 });
      mockRepository.findUserInventoryItem.mockResolvedValue(null);
      mockRepository.createPurchaseTransaction.mockImplementation(() =>
        Promise.resolve({
          purchaseId: `p-${Math.random()}`,
          inventoryId: `i-${Math.random()}`,
          newBalance: 9849,
        }),
      );

      const results = await Promise.allSettled(
        Array.from({ length: 100 }, (_, i) =>
          service.processPurchase(`user-${i}`, { itemId: `item-${i}` }),
        ),
      );

      expect(results.filter((r) => r.status === 'fulfilled')).toHaveLength(100);
    });
  });

  describe('Edge Case Storm — Insufficient Funds', () => {
    it('should reject purchase when balance is exactly 1 credit below price', async () => {
      mockRepository.findActiveStoreItem.mockResolvedValue(mockItem);
      mockRepository.getBalance.mockResolvedValue({ credits: 149 });

      await expect(
        service.processPurchase('user-1', { itemId: mockItem.store_item_id }),
      ).rejects.toThrow(BadRequestException);

      expect(mockRepository.createPurchaseTransaction).not.toHaveBeenCalled();
    });

    it('should accept purchase when balance equals price exactly (newBalance = 0)', async () => {
      mockRepository.findActiveStoreItem.mockResolvedValue(mockItem);
      mockRepository.getBalance.mockResolvedValue({ credits: 150 });
      mockRepository.findUserInventoryItem.mockResolvedValue(null);
      mockRepository.createPurchaseTransaction.mockResolvedValue({
        purchaseId: 'p-exact',
        inventoryId: 'i-exact',
        newBalance: 0,
      });

      const result = await service.processPurchase('user-1', { itemId: mockItem.store_item_id });

      expect(result.status).toBe('success');
      expect(result.newBalance).toBe(0);
      expect(result.creditsSpent).toBe(150);
    });

    it('should reject purchase when balance is 0', async () => {
      mockRepository.findActiveStoreItem.mockResolvedValue(mockItem);
      mockRepository.getBalance.mockResolvedValue({ credits: 0 });

      await expect(
        service.processPurchase('user-1', { itemId: mockItem.store_item_id }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('Edge Case Storm — Invalid Item', () => {
    it('should reject with 404 if item does not exist or is inactive', async () => {
      mockRepository.findActiveStoreItem.mockResolvedValue(null);

      await expect(
        service.processPurchase('user-1', { itemId: 'non-existent-item' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('Atomicity — DB crash mid-transaction', () => {
    it('should throw InternalServerErrorException and not modify balance on DB crash', async () => {
      mockRepository.findActiveStoreItem.mockResolvedValue(mockItem);
      mockRepository.getBalance.mockResolvedValue({ credits: 500 });
      mockRepository.findUserInventoryItem.mockResolvedValue(null);
      mockRepository.createPurchaseTransaction.mockRejectedValue(
        new Error('Simulated DB crash'),
      );

      await expect(
        service.processPurchase('user-1', { itemId: mockItem.store_item_id }),
      ).rejects.toThrow(InternalServerErrorException);

      expect(mockRepository.getBalance).toHaveBeenCalledTimes(1);
    });
  });

  describe('Idempotency — Sequential retry for already owned item', () => {
    it('should reject second attempt with 409 without hitting the DB', async () => {
      mockRepository.findActiveStoreItem.mockResolvedValue(mockItem);
      mockRepository.getBalance.mockResolvedValue({ credits: 500 });
      mockRepository.findUserInventoryItem.mockResolvedValue({
        inventory_id: 'existing-inv',
        user_id: 'user-1',
        store_item_id: mockItem.store_item_id,
      });

      await expect(
        service.processPurchase('user-1', { itemId: mockItem.store_item_id }),
      ).rejects.toThrow(ConflictException);

      expect(mockRepository.createPurchaseTransaction).not.toHaveBeenCalled();
    });
  });

  describe('Double-check — Funds drained between pre-check and DB transaction', () => {
    it('should throw BadRequestException when repository signals INSUFFICIENT_FUNDS', async () => {
      mockRepository.findActiveStoreItem.mockResolvedValue(mockItem);
      mockRepository.getBalance.mockResolvedValue({ credits: 500 });
      mockRepository.findUserInventoryItem.mockResolvedValue(null);
      mockRepository.createPurchaseTransaction.mockRejectedValue(
        new Error('INSUFFICIENT_FUNDS'),
      );

      await expect(
        service.processPurchase('user-1', { itemId: mockItem.store_item_id }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException when user disappears mid-transaction', async () => {
      mockRepository.findActiveStoreItem.mockResolvedValue(mockItem);
      mockRepository.getBalance.mockResolvedValue({ credits: 500 });
      mockRepository.findUserInventoryItem.mockResolvedValue(null);
      mockRepository.createPurchaseTransaction.mockRejectedValue(
        new Error('USER_NOT_FOUND'),
      );

      await expect(
        service.processPurchase('user-1', { itemId: mockItem.store_item_id }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});