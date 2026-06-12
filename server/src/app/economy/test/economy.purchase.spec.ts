import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import { validatePurchase } from '../logic/economy.logic';
import { EconomyService } from '../economy.service';
import { EconomyRepository } from '../economy.repository';
import { PrismaService } from '@nexosdi.synapxix/prisma';

const makePrismaError = (code: string) =>
  new PrismaClientKnownRequestError('mock error', {
    code,
    clientVersion: '5.0.0',
  });

const makeRepositoryPrismaError = (code: string) =>
  new Prisma.PrismaClientKnownRequestError('mock error', {
    code,
    clientVersion: '5.0.0',
  } as any);

const MOCK_ITEM = {
  store_item_id: 'item-uuid-0001',
  name: 'Cyber Banner',
  type: 'banner',
  price: 150,
  is_active: true,
  created_at: new Date(),
};

const MOCK_INVENTORY = {
  inventory_id: 'inv-uuid-0001',
  user_id: 'user-uuid-0001',
  store_item_id: 'item-uuid-0001',
  acquired_at: new Date(),
};

describe('validatePurchase', () => {
  it('approves when balance equals price exactly', () => {
    expect(validatePurchase(100, 100)).toEqual({ valid: true });
  });

  it('approves when balance exceeds price', () => {
    expect(validatePurchase(500, 100)).toEqual({ valid: true });
  });

  it('rejects when balance is below price', () => {
    expect(validatePurchase(50, 100)).toEqual({
      valid: false,
      reason: 'INSUFFICIENT_FUNDS',
    });
  });

  it('rejects when balance is 0', () => {
    expect(validatePurchase(0, 100).valid).toBe(false);
  });

  it('approves a free item with balance 0', () => {
    expect(validatePurchase(0, 0)).toEqual({ valid: true });
  });
});

describe('EconomyService.processPurchase', () => {
  const mockRepository = {
    findActiveStoreItem: jest.fn(),
    getBalance: jest.fn(),
    findUserInventoryItem: jest.fn(),
    createPurchaseTransaction: jest.fn(),
    findTransactionBySessionId: jest.fn(),
    createRewardTransaction: jest.fn(),
  };

  const service = new EconomyService(mockRepository as any);

  const userId = 'user-uuid-1234';
  const itemId = 'item-uuid-5678';

  const mockItem = {
    store_item_id: itemId,
    name: 'Dragon Avatar',
    type: 'avatar',
    price: 200,
    is_active: true,
  };

  beforeEach(() => jest.clearAllMocks());

  it('returns PurchaseResponseDto on happy path', async () => {
    mockRepository.findActiveStoreItem.mockResolvedValue(mockItem);
    mockRepository.getBalance.mockResolvedValue({ credits: 500 });
    mockRepository.findUserInventoryItem.mockResolvedValue(null);
    mockRepository.createPurchaseTransaction.mockResolvedValue({
      purchaseId: 'purchase-uuid-9999',
      inventoryId: 'inv-uuid-1111',
      newBalance: 300,
    });

    const result = await service.processPurchase(userId, { itemId });

    expect(result.status).toBe('success');
    expect(result.newBalance).toBe(300);
    expect(result.creditsSpent).toBe(200);
    expect(result.itemId).toBe(itemId);
  });

  it('throws NotFoundException if item does not exist or is inactive', async () => {
    mockRepository.findActiveStoreItem.mockResolvedValue(null);
    await expect(service.processPurchase(userId, { itemId })).rejects.toThrow(NotFoundException);
  });

  it('throws BadRequestException if funds are insufficient', async () => {
    mockRepository.findActiveStoreItem.mockResolvedValue(mockItem);
    mockRepository.getBalance.mockResolvedValue({ credits: 50 });
    await expect(service.processPurchase(userId, { itemId })).rejects.toThrow(BadRequestException);
  });

  it('throws ConflictException if user already owns the item', async () => {
    mockRepository.findActiveStoreItem.mockResolvedValue(mockItem);
    mockRepository.getBalance.mockResolvedValue({ credits: 500 });
    mockRepository.findUserInventoryItem.mockResolvedValue({ inventory_id: 'existing' });
    await expect(service.processPurchase(userId, { itemId })).rejects.toThrow(ConflictException);
    expect(mockRepository.createPurchaseTransaction).not.toHaveBeenCalled();
  });

  it('maps Prisma P2002 to ConflictException (DB-level race condition)', async () => {
    mockRepository.findActiveStoreItem.mockResolvedValue(mockItem);
    mockRepository.getBalance.mockResolvedValue({ credits: 500 });
    mockRepository.findUserInventoryItem.mockResolvedValue(null);
    mockRepository.createPurchaseTransaction.mockRejectedValue(makePrismaError('P2002'));
    await expect(service.processPurchase(userId, { itemId })).rejects.toThrow(ConflictException);
  });

  it('maps Prisma P2003 to BadRequestException', async () => {
    mockRepository.findActiveStoreItem.mockResolvedValue(mockItem);
    mockRepository.getBalance.mockResolvedValue({ credits: 500 });
    mockRepository.findUserInventoryItem.mockResolvedValue(null);
    mockRepository.createPurchaseTransaction.mockRejectedValue(makePrismaError('P2003'));
    await expect(service.processPurchase(userId, { itemId })).rejects.toThrow(BadRequestException);
  });

  it('throws InternalServerErrorException on unknown error', async () => {
    mockRepository.findActiveStoreItem.mockResolvedValue(mockItem);
    mockRepository.getBalance.mockResolvedValue({ credits: 500 });
    mockRepository.findUserInventoryItem.mockResolvedValue(null);
    mockRepository.createPurchaseTransaction.mockRejectedValue(new Error('DB connection lost'));
    await expect(service.processPurchase(userId, { itemId })).rejects.toThrow(InternalServerErrorException);
  });

  it('does NOT call createPurchaseTransaction when funds are insufficient', async () => {
    mockRepository.findActiveStoreItem.mockResolvedValue(mockItem);
    mockRepository.getBalance.mockResolvedValue({ credits: 10 });
    await expect(service.processPurchase(userId, { itemId })).rejects.toThrow(BadRequestException);
    expect(mockRepository.createPurchaseTransaction).not.toHaveBeenCalled();
  });

  it('maps INSUFFICIENT_FUNDS error from repository to BadRequestException', async () => {
    mockRepository.findActiveStoreItem.mockResolvedValue(mockItem);
    mockRepository.getBalance.mockResolvedValue({ credits: 500 });
    mockRepository.findUserInventoryItem.mockResolvedValue(null);
    mockRepository.createPurchaseTransaction.mockRejectedValue(new Error('INSUFFICIENT_FUNDS'));
    await expect(service.processPurchase(userId, { itemId })).rejects.toThrow(BadRequestException);
  });

  it('maps USER_NOT_FOUND error from repository to NotFoundException', async () => {
    mockRepository.findActiveStoreItem.mockResolvedValue(mockItem);
    mockRepository.getBalance.mockResolvedValue({ credits: 500 });
    mockRepository.findUserInventoryItem.mockResolvedValue(null);
    mockRepository.createPurchaseTransaction.mockRejectedValue(new Error('USER_NOT_FOUND'));
    await expect(service.processPurchase(userId, { itemId })).rejects.toThrow(NotFoundException);
  });
});

describe('EconomyRepository — Store & Purchase', () => {
  let repository: EconomyRepository;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EconomyRepository,
        {
          provide: PrismaService,
          useValue: {
            $transaction: jest.fn(),
            storeItem: { findFirst: jest.fn() },
            userInventory: { findUnique: jest.fn() },
            app_user: { findUnique: jest.fn(), updateMany: jest.fn() },
            auditLog: { create: jest.fn() },
          },
        },
      ],
    }).compile();

    repository = module.get<EconomyRepository>(EconomyRepository);
    prismaService = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  describe('findActiveStoreItem', () => {
    it('should return the item when it exists and is active', async () => {
      (prismaService.storeItem.findFirst as jest.Mock).mockResolvedValue(MOCK_ITEM);

      const result = await repository.findActiveStoreItem('item-uuid-0001');

      expect(result).toEqual(MOCK_ITEM);
      expect(prismaService.storeItem.findFirst).toHaveBeenCalledWith({
        where: { store_item_id: 'item-uuid-0001', is_active: true },
      });
    });

    it('should return null when the item does not exist', async () => {
      (prismaService.storeItem.findFirst as jest.Mock).mockResolvedValue(null);
      expect(await repository.findActiveStoreItem('nonexistent-item')).toBeNull();
    });

    it('should return null when the item exists but is inactive', async () => {
      (prismaService.storeItem.findFirst as jest.Mock).mockResolvedValue(null);

      const result = await repository.findActiveStoreItem('inactive-item-uuid');

      expect(result).toBeNull();
      expect(prismaService.storeItem.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ is_active: true }),
        }),
      );
    });

    it('should propagate unexpected DB errors', async () => {
      (prismaService.storeItem.findFirst as jest.Mock).mockRejectedValue(new Error('DB connection lost'));
      await expect(repository.findActiveStoreItem('item-uuid-0001')).rejects.toThrow('DB connection lost');
    });
  });

  describe('findUserInventoryItem', () => {
    it('should return the inventory entry when user owns the item', async () => {
      (prismaService.userInventory.findUnique as jest.Mock).mockResolvedValue(MOCK_INVENTORY);

      const result = await repository.findUserInventoryItem('user-uuid-0001', 'item-uuid-0001');

      expect(result).toEqual(MOCK_INVENTORY);
      expect(prismaService.userInventory.findUnique).toHaveBeenCalledWith({
        where: {
          user_id_store_item_id: {
            user_id: 'user-uuid-0001',
            store_item_id: 'item-uuid-0001',
          },
        },
      });
    });

    it('should return null when the user does not own the item', async () => {
      (prismaService.userInventory.findUnique as jest.Mock).mockResolvedValue(null);
      expect(await repository.findUserInventoryItem('user-uuid-0001', 'item-uuid-9999')).toBeNull();
    });

    it('should use the compound unique key (user_id_store_item_id)', async () => {
      (prismaService.userInventory.findUnique as jest.Mock).mockResolvedValue(null);

      await repository.findUserInventoryItem('user-A', 'item-B');

      expect(prismaService.userInventory.findUnique).toHaveBeenCalledWith({
        where: {
          user_id_store_item_id: { user_id: 'user-A', store_item_id: 'item-B' },
        },
      });
    });

    it('should propagate unexpected DB errors', async () => {
      (prismaService.userInventory.findUnique as jest.Mock).mockRejectedValue(new Error('Timeout'));
      await expect(repository.findUserInventoryItem('user-uuid-0001', 'item-uuid-0001')).rejects.toThrow('Timeout');
    });
  });

  describe('createPurchaseTransaction — Atomicity', () => {
    const purchaseInput = {
      itemId: MOCK_ITEM.store_item_id,
      itemName: MOCK_ITEM.name,
      itemType: MOCK_ITEM.type,
      itemPrice: MOCK_ITEM.price,
      balanceBefore: 500,
    };

    const makeTxClient = (overrides: Record<string, unknown> = {}) => ({
      app_user: {
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
        findUnique: jest.fn().mockResolvedValue({ credits: 350 }),
      },
      userInventory: {
        create: jest.fn().mockResolvedValue({ inventory_id: 'inv-uuid-new' }),
      },
      purchaseTransaction: {
        create: jest.fn().mockResolvedValue({ purchase_id: 'purchase-uuid-new' }),
      },
      auditLog: {
        create: jest.fn().mockResolvedValue({ audit_id: 'audit-uuid-new' }),
      },
      ...overrides,
    });

    it('should return purchaseId, inventoryId and newBalance on success', async () => {
      (prismaService.$transaction as jest.Mock).mockImplementation(
        async (callback) => callback(makeTxClient()),
      );

      const result = await repository.createPurchaseTransaction('user-uuid-0001', purchaseInput);

      expect(result.purchaseId).toBe('purchase-uuid-new');
      expect(result.inventoryId).toBe('inv-uuid-new');
      expect(result.newBalance).toBe(350);
    });

    it('should decrement credits with WHERE credits >= itemPrice (double-check)', async () => {
      const userUpdateManyMock = jest.fn().mockResolvedValue({ count: 1 });
      const txClient = makeTxClient({
        app_user: {
          updateMany: userUpdateManyMock,
          findUnique: jest.fn().mockResolvedValue({ credits: 350 }),
        },
      });

      (prismaService.$transaction as jest.Mock).mockImplementation(
        async (callback) => callback(txClient),
      );

      await repository.createPurchaseTransaction('user-uuid-0001', purchaseInput);

      expect(userUpdateManyMock).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            user_id: 'user-uuid-0001',
            credits: { gte: purchaseInput.itemPrice },
          }),
          data: { credits: { decrement: purchaseInput.itemPrice } },
        }),
      );
    });

    it('should throw INSUFFICIENT_FUNDS when updateMany count is 0', async () => {
      const txClient = makeTxClient({
        app_user: {
          updateMany: jest.fn().mockResolvedValue({ count: 0 }),
          findUnique: jest.fn(),
        },
      });

      (prismaService.$transaction as jest.Mock).mockImplementation(
        async (callback) => callback(txClient),
      );

      await expect(
        repository.createPurchaseTransaction('user-uuid-0001', purchaseInput),
      ).rejects.toThrow('INSUFFICIENT_FUNDS');
    });

    it('should write an audit log with correct financial details', async () => {
      const auditCreateMock = jest.fn().mockResolvedValue({ audit_id: 'audit-1' });
      const txClient = makeTxClient({
        app_user: {
          updateMany: jest.fn().mockResolvedValue({ count: 1 }),
          findUnique: jest.fn().mockResolvedValue({ credits: 350 }),
        },
        userInventory: { create: jest.fn().mockResolvedValue({ inventory_id: 'inv-uuid-new' }) },
        purchaseTransaction: { create: jest.fn().mockResolvedValue({ purchase_id: 'purchase-uuid-new' }) },
        auditLog: { create: auditCreateMock },
      });

      (prismaService.$transaction as jest.Mock).mockImplementation(
        async (callback) => callback(txClient),
      );

      await repository.createPurchaseTransaction('user-uuid-0001', purchaseInput);

      expect(auditCreateMock).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            table_name: 'purchase_transaction',
            details: expect.objectContaining({
              credits_spent: purchaseInput.itemPrice,
              balance_before: purchaseInput.balanceBefore,
              balance_after: 350,
              transaction_type: 'PURCHASE',
            }),
          }),
        }),
      );
    });

    it('should rollback if any step inside the transaction throws', async () => {
      (prismaService.$transaction as jest.Mock).mockImplementation(async () => {
        throw new Error('Simulated rollback — inventory insert failed');
      });

      await expect(
        repository.createPurchaseTransaction('user-uuid-0001', purchaseInput),
      ).rejects.toThrow('Simulated rollback — inventory insert failed');
    });

    it('should rollback if auditLog.create fails (all-or-nothing)', async () => {
      const txClient = makeTxClient({
        auditLog: {
          create: jest.fn().mockRejectedValue(new Error('Audit write failed')),
        },
      });

      (prismaService.$transaction as jest.Mock).mockImplementation(
        async (callback) => callback(txClient),
      );

      await expect(
        repository.createPurchaseTransaction('user-uuid-0001', purchaseInput),
      ).rejects.toThrow('Audit write failed');
    });

    it('should propagate P2002 (unique constraint) without wrapping', async () => {
      (prismaService.$transaction as jest.Mock).mockRejectedValue(makeRepositoryPrismaError('P2002'));

      await expect(
        repository.createPurchaseTransaction('user-uuid-0001', purchaseInput),
      ).rejects.toMatchObject({ code: 'P2002' });
    });

    it('should propagate P2003 (FK violation) without wrapping', async () => {
      (prismaService.$transaction as jest.Mock).mockRejectedValue(makeRepositoryPrismaError('P2003'));

      await expect(
        repository.createPurchaseTransaction('ghost-user', purchaseInput),
      ).rejects.toMatchObject({ code: 'P2003' });
    });

    it('should execute exactly one $transaction call per purchase attempt', async () => {
      (prismaService.$transaction as jest.Mock).mockImplementation(
        async (callback) => callback(makeTxClient()),
      );

      await repository.createPurchaseTransaction('user-uuid-0001', purchaseInput);

      expect(prismaService.$transaction).toHaveBeenCalledTimes(1);
    });
  });
});