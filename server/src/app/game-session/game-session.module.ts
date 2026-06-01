import { Module } from '@nestjs/common';
import { GameSessionController } from './game-session.controller';
import { GameSessionService } from './game-session.service';
import { GameSessionRepository } from './game-session.repository';
import { PrismaModule } from '@nexosdi.synapxix/prisma';

@Module({
  imports: [PrismaModule],
  controllers: [GameSessionController],
  providers: [GameSessionService, GameSessionRepository],
})
export class GameSessionModule {}
