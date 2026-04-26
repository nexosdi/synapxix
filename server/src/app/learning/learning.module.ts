import { Inject, Module, OnModuleDestroy } from '@nestjs/common';
import neo4j, { Driver } from 'neo4j-driver';
import { LearningController } from './learning.controller';
import { LearningService, NEO4J_DRIVER } from './learning.service';

@Module({
  controllers: [LearningController],
  providers: [
    {
      provide: NEO4J_DRIVER,
      useFactory: () => {
        const uri = process.env.NEO4J_URI ?? 'neo4j://localhost:7687';
        const username = process.env.NEO4J_USERNAME ?? 'neo4j';
        const password = process.env.NEO4J_PASSWORD ?? 'neo4j';

        return neo4j.driver(uri, neo4j.auth.basic(username, password), {
          disableLosslessIntegers: true,
        });
      },
    },
    LearningService,
  ],
  exports: [LearningService],
})
export class LearningModule implements OnModuleDestroy {
  constructor(@Inject(NEO4J_DRIVER) private readonly driver: Driver) {}

  async onModuleDestroy(): Promise<void> {
    await this.driver.close();
  }
}
