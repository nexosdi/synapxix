import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { AuthModule } from './auth/auth.module';
import { LearningModule } from './learning/learning.module';
// Mantenemos ambos imports nuevos
import { ProfileModule } from './profile/profile.module';
import { ResearchModule } from './modules/research/research.module';
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    AuthModule, 
    LearningModule, 
    ProfileModule, // Tu cambio
    ResearchModule, // El cambio de main
    ConfigModule.forRoot({ isGlobal: true }), // El cambio de main
  ],
  controllers: [AppController],
  providers: [AppService, JwtAuthGuard],
})
export class AppModule {}