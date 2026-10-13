import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '@nexosdi.synapxix/prisma';
import type { KeycloakJwtPayload } from './jwt.strategy';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

@Injectable()
export class AuthenticatedUserProvisioningService {
  constructor(private readonly prisma: PrismaService) {}

  async ensureUser(payload: KeycloakJwtPayload): Promise<void> {
    const userId = payload.sub;
    if (typeof userId !== 'string' || !UUID_PATTERN.test(userId)) {
      throw new UnauthorizedException('Invalid authenticated subject');
    }

    const usernameClaim = claimText(payload.preferred_username);
    const emailClaim = claimText(payload.email);
    const nameClaim = claimText(payload.name);
    const username = (usernameClaim ?? `user-${userId.slice(0, 8)}`).slice(0, 150);
    const email = (emailClaim ?? `${userId}@identity.invalid`).slice(0, 150);
    const [firstName, ...lastNameParts] = nameClaim?.split(/\s+/) ?? [];
    const identity = {
      username,
      email,
      firstname: (firstName || username).slice(0, 150),
      lastname: lastNameParts.join(' ').slice(0, 150),
    };

    await this.prisma.app_user.upsert({
      where: { user_id: userId },
      create: { user_id: userId, ...identity },
      // Only identity claims are synchronized; roles and local profile data stay untouched.
      update: {
        ...(usernameClaim ? { username: identity.username } : {}),
        ...(emailClaim ? { email: identity.email } : {}),
        ...(nameClaim ? { firstname: identity.firstname, lastname: identity.lastname } : {}),
      },
    });
  }
}

function claimText(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}
