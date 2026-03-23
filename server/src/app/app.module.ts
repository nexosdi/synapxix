import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { AuthModule } from './auth/auth.module';
import { LearningModule } from './learning/learning.module';
import { ResearchModule } from './modules/research/research.module';
import {ConfigModule} from "@nestjs/config";
@Module({
  imports: [AuthModule, LearningModule, ResearchModule, ConfigModule.forRoot({ isGlobal: true }),],
  controllers: [AppController],
  providers: [AppService, JwtAuthGuard],
})
export class AppModule {}
