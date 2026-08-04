import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { PrismaService } from '@nexosdi.synapxix/prisma';

/** Acceso a datos del equipo. Solo toca `core.team_member`; D.A.L.A. jamás. */
@Injectable()
export class TeamRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** Código legible tipo SX-7KQ2-M9. Sin ambigüedad 0/O ni 1/I. */
  private generateCode(): string {
    const alphabet = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
    const pick = (n: number) =>
      Array.from(randomBytes(n), (b) => alphabet[b % alphabet.length]).join('');
    return `SX-${pick(4)}-${pick(2)}`;
  }

  async createInvites(people: Array<{ name?: string; email?: string; roleLabel?: string }>) {
    const created = [];
    for (const person of people) {
      created.push(
        await this.prisma.teamMember.create({
          data: {
            invite_code: this.generateCode(),
            name: person.name ?? null,
            email: person.email ?? null,
            role_label: person.roleLabel ?? null,
          },
        }),
      );
    }
    return created;
  }

  findByInviteCode(code: string) {
    return this.prisma.teamMember.findUnique({ where: { invite_code: code } });
  }

  findById(memberId: string) {
    return this.prisma.teamMember.findUnique({ where: { member_id: memberId } });
  }

  markJoined(memberId: string, name?: string, roleLabel?: string) {
    return this.prisma.teamMember.update({
      where: { member_id: memberId },
      data: {
        status: 'joined',
        joined_at: new Date(),
        ...(name ? { name } : {}),
        ...(roleLabel ? { role_label: roleLabel } : {}),
      },
    });
  }

  saveDeclared(memberId: string, declared: object) {
    return this.prisma.teamMember.update({
      where: { member_id: memberId },
      data: { declared_json: declared },
    });
  }

  markCompleted(memberId: string, archetype?: string) {
    return this.prisma.teamMember.update({
      where: { member_id: memberId },
      data: {
        status: 'completed',
        completed_at: new Date(),
        ...(archetype ? { archetype } : {}),
      },
    });
  }

  listMembers() {
    return this.prisma.teamMember.findMany({ orderBy: { created_at: 'asc' } });
  }
}
