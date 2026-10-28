import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';
import { NotFoundException } from '@nestjs/common';
import { ProfileController } from '../profile.controller';
import { ProfileService } from '../profile.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { UpdatePreferencesDto } from '../dto/updated-preferences';

describe('ProfileController', () => {
  let controller: ProfileController;
  let service: ProfileService;

  const mockProfileService = {
    getPreferences: jest.fn(),
    updatePreferences: jest.fn(),
  };

  const mockUserId = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

  const mockRequest = {
    user: {
      sub: mockUserId,
    },
  } as unknown as Request;

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
      controllers: [ProfileController],
      providers: [
        {
          provide: ProfileService,
          useValue: mockProfileService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ProfileController>(ProfileController);
    service = module.get<ProfileService>(ProfileService);
    jest.clearAllMocks();
  });

  describe('GET /preferences', () => {
    it('should return preferences for authenticated user', async () => {
      mockProfileService.getPreferences.mockResolvedValue(mockProfile);

      const result = await controller.get(mockRequest);

      expect(result).toEqual(mockProfile);
      expect(service.getPreferences).toHaveBeenCalledWith(mockUserId);
      expect(service.getPreferences).toHaveBeenCalledTimes(1);
    });

    it('should propagate NotFoundException when user is not found', async () => {
      mockProfileService.getPreferences.mockRejectedValue(
        new NotFoundException(`User profile not found for userId: ${mockUserId}`),
      );

      await expect(controller.get(mockRequest)).rejects.toThrow(
        NotFoundException,
      );
      await expect(controller.get(mockRequest)).rejects.toThrow(
        `User profile not found for userId: ${mockUserId}`,
      );
      expect(service.getPreferences).toHaveBeenCalledWith(mockUserId);
    });
  });

  describe('PATCH /preferences', () => {
    it('should update preferences and return the updated profile', async () => {
      const dto: UpdatePreferencesDto = {
        theme: 'light',
        language: 'en',
        notifications: false,
      };

      const updatedProfile = {
        ...mockProfile,
        ...dto,
      };

      mockProfileService.updatePreferences.mockResolvedValue(updatedProfile);

      const result = await controller.update(mockRequest, dto);

      expect(result).toEqual(updatedProfile);
      expect(service.updatePreferences).toHaveBeenCalledWith(mockUserId, dto);
      expect(service.updatePreferences).toHaveBeenCalledTimes(1);
    });

    it('should propagate service errors during update', async () => {
      const dto: UpdatePreferencesDto = {
        theme: 'light',
      };

      mockProfileService.updatePreferences.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(controller.update(mockRequest, dto)).rejects.toThrow(
        'Database error',
      );
      expect(service.updatePreferences).toHaveBeenCalledWith(mockUserId, dto);
    });
  });
});
