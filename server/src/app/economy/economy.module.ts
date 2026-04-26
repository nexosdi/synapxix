import { Module } from '@nestjs/common';
import { PrismaModule } from '@nexosdi.synapxix/prisma';
import { EconomyService } from './economy.service';
import { EconomyController } from './economy.controller';
import { EconomyRepository } from './economy.repository';

@Module({
  imports: [PrismaModule],
  controllers: [EconomyController],
  providers: [EconomyService, EconomyRepository],
  exports: [EconomyService],
})
export class EconomyModule {}