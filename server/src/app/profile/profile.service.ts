import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../libs/prisma/src/lib/services/prisma.service'; 
import { UpdatePreferencesDto } from './dto/updated-preferences';


@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  // Lectura
  async getPreferences(userId: string) {
    return this.prisma.userProfile.findUnique({
      where: { userId },
    });
  }

  // Escritura (Upsert: crea si no existe, actualiza si existe)
  // profile.service.ts
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