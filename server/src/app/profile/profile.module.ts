// /server/src/app/profile/profile.module.ts
import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { PrismaModule } from '@nexosdi.synapxix/prisma';
import { ArchetypeController } from './archetype/archetype.controller';
import { ArchetypeService } from './archetype/archetype.service';

@Module({
  imports: [PrismaModule],
  controllers: [ProfileController, ArchetypeController],
  providers: [ProfileService, ArchetypeService],
})
export class ProfileModule {}