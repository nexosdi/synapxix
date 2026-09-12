import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { ArchetypeService } from './archetype.service';

@Controller('profile/:userId/archetype')
@UseGuards(JwtAuthGuard)
export class ArchetypeController {
  constructor(private readonly archetypeService: ArchetypeService) {}

  @Get()
  async getArchetype(@Param('userId') userId: string) {
    return this.archetypeService.calculateArchetype(userId);
  }
}
