import { Module } from '@nestjs/common';
import { EvaluativeService } from './evaluative.service';
import { EvaluativeController } from './evaluative.controller';
import { ResearchModule } from '../modules/research/research.module';
import { PrismaModule } from '@nexosdi.synapxix/prisma';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';

@Module({
  imports: [
    ResearchModule, 
    PrismaModule,
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const store = await redisStore({
          socket: {
            host: configService.get('REDIS_HOST') || 'localhost',
            port: parseInt(configService.get('REDIS_PORT') || '6379', 10),
          },
          password: configService.get('REDIS_PASSWORD') || 'changeme',
          ttl: 300000, // 5 minutes in ms
        });
        return { store };
      },
    }),
  ],
  controllers: [EvaluativeController],
  providers: [EvaluativeService],
})
export class EvaluativeModule {}

