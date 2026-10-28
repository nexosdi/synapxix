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

  /** Identidad de la inscripción abierta: el email (case-insensitive). */
  findByEmail(email: string) {
    return this.prisma.teamMember.findFirst({
      where: { email: { equals: email, mode: 'insensitive' } },
      orderBy: { created_at: 'asc' },
    });
  }

  /** Alta por inscripción abierta: nace directamente en estado joined. */
  createOpen(input: { name: string; email: string; roleLabel?: string }) {
    return this.prisma.teamMember.create({
      data: {
        invite_code: this.generateCode(),
        name: input.name,
        email: input.email,
        role_label: input.roleLabel ?? null,
        status: 'joined',
        joined_at: new Date(),
      },
    });
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

  /** Consentimiento vigente: reemplaza al anterior (la versión va dentro). */
  saveConsent(memberId: string, consent: object) {
    return this.prisma.teamMember.update({
      where: { member_id: memberId },
      data: { consent_json: consent },
    });
  }

  saveDocuments(
    memberId: string,
    docs: Array<{ kind: 'cv' | 'link'; filename?: string; mime?: string; size?: number; data?: Buffer; url?: string }>,
    consent: object,
  ) {
    return this.prisma.$transaction(
      docs.map((d) =>
        this.prisma.teamDocument.create({
          data: {
            member_id: memberId,
            kind: d.kind,
            filename: d.filename ?? null,
            mime: d.mime ?? null,
            size: d.size ?? null,
            data: d.data ? new Uint8Array(d.data) : null,
            url: d.url ?? null,
            consent_json: consent,
          },
          select: { document_id: true, kind: true },
        }),
      ),
    );
  }

  /** Sin el contenido: la lista solo describe qué se entregó. */
  listDocuments(memberId: string) {
    return this.prisma.teamDocument.findMany({
      where: { member_id: memberId },
      orderBy: { created_at: 'desc' },
      select: { document_id: true, kind: true, filename: true, mime: true, size: true, url: true, created_at: true },
    });
  }

  findDocument(memberId: string, documentId: string) {
    return this.prisma.teamDocument.findFirst({ where: { member_id: memberId, document_id: documentId } });
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
