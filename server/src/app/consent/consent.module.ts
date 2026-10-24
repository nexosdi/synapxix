import { Module } from '@nestjs/common';
import { PrismaModule } from '@nexosdi.synapxix/prisma';
import { ConsentController } from './consent.controller';
import { ConsentService } from './consent.service';

@Module({
  imports: [PrismaModule],
  controllers: [ConsentController],
  providers: [ConsentService],
  exports: [ConsentService],
})
export class ConsentModule {}
