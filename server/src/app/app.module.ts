import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { AuthModule } from './auth/auth.module';
import { LearningModule } from './learning/learning.module';
import { EconomyModule } from './economy/economy.module';

@Module({
  imports: [AuthModule, LearningModule, EconomyModule],
  controllers: [AppController],
  providers: [AppService, JwtAuthGuard],
})
export class AppModule {}