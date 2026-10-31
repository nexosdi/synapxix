import { Test, TestingModule } from '@nestjs/testing';
import { ConsentService } from '../consent.service';
import { PrismaService } from '@nexosdi.synapxix/prisma';
import { UpdateConsentDto } from '../dto/update-consent.dto';

describe('ConsentService', () => {
  let service: ConsentService;

  const mockPrismaService = {
    app_user: {
      upsert: jest.fn(),
    },
    dalaConsent: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConsentService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ConsentService>(ConsentService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCurrentConsent', () => {
    it('should query findFirst with default research scope and descending order', async () => {
      const mockResult = {
        consent_id: 'consent-1',
        user_id: 'user-123',
        scope: 'research',
        status: 'GRANTED',
        version: 'v1.0',
      };
      mockPrismaService.dalaConsent.findFirst.mockResolvedValue(mockResult);

      const result = await service.getCurrentConsent('user-123');

      expect(result).toEqual(mockResult);
      expect(mockPrismaService.dalaConsent.findFirst).toHaveBeenCalledWith({
        where: { user_id: 'user-123', scope: 'research' },
        orderBy: { granted_at: 'desc' },
      });
    });

    it('should allow custom scope parameter', async () => {
      mockPrismaService.dalaConsent.findFirst.mockResolvedValue(null);

      const result = await service.getCurrentConsent('user-123', 'analytics');

      expect(result).toBeNull();
      expect(mockPrismaService.dalaConsent.findFirst).toHaveBeenCalledWith({
        where: { user_id: 'user-123', scope: 'analytics' },
        orderBy: { granted_at: 'desc' },
      });
    });
  });

  describe('updateConsent', () => {
    const userId = 'keycloak-uuid-456';
    const dto: UpdateConsentDto = {
      version: 'v1.0',
      scope: 'research',
      status: 'GRANTED',
    };

    it('should defensively upsert app_user before writing consent to ensure FK integrity', async () => {
      mockPrismaService.app_user.upsert.mockResolvedValue({});
      mockPrismaService.dalaConsent.findUnique.mockResolvedValue(null);
      mockPrismaService.dalaConsent.create.mockResolvedValue({
        consent_id: 'new-consent-id',
        user_id: userId,
        version: dto.version,
        scope: dto.scope,
        status: dto.status,
      });

      await service.updateConsent(userId, dto);

      expect(mockPrismaService.app_user.upsert).toHaveBeenCalledWith({
        where: { user_id: userId },
        update: {},
        create: {
          user_id: userId,
          username: userId,
          email: `${userId}@synapxix.local`,
          firstname: 'User',
          lastname: 'Synapxix',
          role: 'user',
        },
      });
      expect(mockPrismaService.dalaConsent.create).toHaveBeenCalled();
    });

    it('should proceed and not throw if app_user upsert fails (catch handler)', async () => {
      mockPrismaService.app_user.upsert.mockRejectedValue(new Error('DB connection hiccup'));
      mockPrismaService.dalaConsent.findUnique.mockResolvedValue(null);
      mockPrismaService.dalaConsent.create.mockResolvedValue({
        consent_id: 'consent-id',
      });

      await expect(service.updateConsent(userId, dto)).resolves.toBeDefined();
      expect(mockPrismaService.dalaConsent.findUnique).toHaveBeenCalled();
    });

    it('should update existing record if already exists', async () => {
      mockPrismaService.app_user.upsert.mockResolvedValue({});
      mockPrismaService.dalaConsent.findUnique.mockResolvedValue({
        consent_id: 'existing-consent-123',
        status: 'GRANTED',
      });
      mockPrismaService.dalaConsent.update.mockResolvedValue({
        consent_id: 'existing-consent-123',
        status: 'REVOKED',
      });

      const revokeDto: UpdateConsentDto = { ...dto, status: 'REVOKED' };
      const result = await service.updateConsent(userId, revokeDto);

      expect(mockPrismaService.dalaConsent.update).toHaveBeenCalledWith({
        where: { consent_id: 'existing-consent-123' },
        data: {
          status: 'REVOKED',
          revoked_at: expect.any(Date),
        },
      });
      expect(mockPrismaService.dalaConsent.create).not.toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should set revoked_at to null when re-granting consent on existing record', async () => {
      mockPrismaService.app_user.upsert.mockResolvedValue({});
      mockPrismaService.dalaConsent.findUnique.mockResolvedValue({
        consent_id: 'existing-consent-123',
        status: 'REVOKED',
      });
      mockPrismaService.dalaConsent.update.mockResolvedValue({
        consent_id: 'existing-consent-123',
        status: 'GRANTED',
        revoked_at: null,
      });

      await service.updateConsent(userId, dto);

      expect(mockPrismaService.dalaConsent.update).toHaveBeenCalledWith({
        where: { consent_id: 'existing-consent-123' },
        data: {
          status: 'GRANTED',
          revoked_at: null,
        },
      });
    });

    it('should create new record when consent does not exist', async () => {
      mockPrismaService.app_user.upsert.mockResolvedValue({});
      mockPrismaService.dalaConsent.findUnique.mockResolvedValue(null);
      mockPrismaService.dalaConsent.create.mockResolvedValue({
        consent_id: 'new-consent-id',
        user_id: userId,
        version: dto.version,
        scope: dto.scope,
        status: 'REVOKED',
        revoked_at: new Date(),
      });

      const revokeDto: UpdateConsentDto = { ...dto, status: 'REVOKED' };
      await service.updateConsent(userId, revokeDto);

      expect(mockPrismaService.dalaConsent.create).toHaveBeenCalledWith({
        data: {
          user_id: userId,
          version: revokeDto.version,
          scope: revokeDto.scope,
          status: 'REVOKED',
          revoked_at: expect.any(Date),
        },
      });
    });
  });
});
