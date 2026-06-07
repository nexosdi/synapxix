import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { AuthModule } from './auth/auth.module';
import { LearningModule } from './learning/learning.module';
import { EconomyModule } from './economy/economy.module';
import { GameSessionModule } from './game-session/game-session.module';
import { EvaluativeModule } from './evaluative/evaluative.module';
import { ExercisesModule } from './exercises/exercises.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule, 
    LearningModule, 
    EconomyModule, 
    GameSessionModule, 
    EvaluativeModule,
    ExercisesModule
  ],
  controllers: [AppController],
  providers: [AppService, JwtAuthGuard],
})
export class AppModule {}