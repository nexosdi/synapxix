import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { AuthModule } from './auth/auth.module';
import { LearningModule } from './learning/learning.module';
import { EconomyModule } from './economy/economy.module';
import { GameSessionModule } from './game-session/game-session.module';
import { EvaluativeModule } from './evaluative/evaluative.module';

@Module({
  imports: [AuthModule, LearningModule, EconomyModule, GameSessionModule, EvaluativeModule],
  controllers: [AppController],
  providers: [AppService, JwtAuthGuard],
})
export class AppModule {}