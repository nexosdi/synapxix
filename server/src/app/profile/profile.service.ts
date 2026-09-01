import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@nexosdi.synapxix/prisma'; 
import { UpdatePreferencesDto } from './dto/updated-preferences';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  // Lectura
  async getPreferences(userId: string) {
    const profile = await this.prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException(`User profile not found for userId: ${userId}`);
    }

    return profile;
  }

  // Escritura (Upsert: crea si no existe, actualiza si existe)
  async updatePreferences(userId: string, data: UpdatePreferencesDto) {
    return this.prisma.userProfile.upsert({
      where: { userId },
      update: data,
      create: {
        ...data,
        userId,
      },
    });
  }
}