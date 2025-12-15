import { Module } from '@nestjs/common';
import { DimensionsService } from './dimensions.service';
import { DimensionsController } from './dimensions.controller';
import { PrismaService } from '@nexosdi.synapxix/prisma';

@Module({
  controllers: [DimensionsController],
  providers: [DimensionsService, PrismaService],
  exports: [DimensionsService]
})
export class DimensionsModule { }
