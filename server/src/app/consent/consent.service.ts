import { Injectable } from '@nestjs/common';
import { PrismaService } from '@nexosdi.synapxix/prisma';
import { UpdateConsentDto } from './dto/update-consent.dto';

@Injectable()
export class ConsentService {
  constructor(private readonly prisma: PrismaService) {}

  async getCurrentConsent(userId: string, scope = 'research') {
    return this.prisma.dalaConsent.findFirst({
      where: { user_id: userId, scope },
      orderBy: { granted_at: 'desc' },
    });
  }

  async updateConsent(userId: string, dto: UpdateConsentDto) {
    const existing = await this.prisma.dalaConsent.findUnique({
      where: {
        user_id_scope_version: {
          user_id: userId,
          scope: dto.scope,
          version: dto.version,
        },
      },
    });

    if (existing) {
      return this.prisma.dalaConsent.update({
        where: { consent_id: existing.consent_id },
        data: {
          status: dto.status,
          revoked_at: dto.status === 'REVOKED' ? new Date() : null,
        },
      });
    }

    return this.prisma.dalaConsent.create({
      data: {
        user_id: userId,
        version: dto.version,
        scope: dto.scope,
        status: dto.status,
        revoked_at: dto.status === 'REVOKED' ? new Date() : null,
      },
    });
  }
}
