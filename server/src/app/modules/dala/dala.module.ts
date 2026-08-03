import { Module } from '@nestjs/common';
import { PrismaService } from '@nexosdi.synapxix/prisma';
import { DalaController } from './dala.controller';
import { DalaFacade } from './dala.facade';
import { DalaRepository } from './dala.repository';

/**
 * Bounded context D.A.L.A.™ dentro del backend Synapxix.
 *
 * Diseñado para extraerse: la lógica vive en libs/dala/{contracts,domain};
 * este módulo solo aporta transporte HTTP y persistencia. Exporta la fachada
 * para que otros módulos (game-session, evaluative) emitan eventos sin
 * conocer el interior del motor.
 */
@Module({
  controllers: [DalaController],
  providers: [DalaFacade, DalaRepository, PrismaService],
  exports: [DalaFacade],
})
export class DalaModule {}
