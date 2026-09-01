import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '@nexosdi.synapxix/prisma';
import { ProfileService } from '../profile.service';
import { UpdatePreferencesDto } from '../dto/updated-preferences';

describe('ProfileService', () => {
  let service: ProfileService;

  const mockPrismaService = {
    userProfile: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
    },
  };

  const mockUserId = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

  const mockProfile = {
    id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    userId: mockUserId,
    theme: 'dark',
    language: 'es',
    notifications: true,
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
    jest.clearAllMocks();
  });

  describe('getPreferences', () => {
    it('should return user preferences when profile is found', async () => {
      mockPrismaService.userProfile.findUnique.mockResolvedValue(mockProfile);

      const result = await service.getPreferences(mockUserId);

      expect(result).toEqual(mockProfile);
      expect(mockPrismaService.userProfile.findUnique).toHaveBeenCalledWith({
        where: { userId: mockUserId },
      });
      expect(mockPrismaService.userProfile.findUnique).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when profile is not found', async () => {
      mockPrismaService.userProfile.findUnique.mockResolvedValue(null);

      await expect(service.getPreferences(mockUserId)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.getPreferences(mockUserId)).rejects.toThrow(
        `User profile not found for userId: ${mockUserId}`,
      );
      expect(mockPrismaService.userProfile.findUnique).toHaveBeenCalledWith({
        where: { userId: mockUserId },
      });
    });
  });

  describe('updatePreferences', () => {
    it('should upsert user preferences with full payload', async () => {
      const dto: UpdatePreferencesDto = {
        theme: 'light',
        language: 'en',
        notifications: false,
      };

      const updatedProfile = {
        ...mockProfile,
        ...dto,
      };

      mockPrismaService.userProfile.upsert.mockResolvedValue(updatedProfile);

      const result = await service.updatePreferences(mockUserId, dto);

      expect(result).toEqual(updatedProfile);
      expect(mockPrismaService.userProfile.upsert).toHaveBeenCalledWith({
        where: { userId: mockUserId },
        update: dto,
        create: {
          ...dto,
          userId: mockUserId,
        },
      });
    });

    it('should upsert user preferences with partial payload', async () => {
      const partialDto: UpdatePreferencesDto = {
        theme: 'dark',
      };

      const updatedProfile = {
        ...mockProfile,
        theme: 'dark',
      };

      mockPrismaService.userProfile.upsert.mockResolvedValue(updatedProfile);

      const result = await service.updatePreferences(mockUserId, partialDto);

      expect(result).toEqual(updatedProfile);
      expect(mockPrismaService.userProfile.upsert).toHaveBeenCalledWith({
        where: { userId: mockUserId },
        update: partialDto,
        create: {
          ...partialDto,
          userId: mockUserId,
        },
      });
    });
  });
});
