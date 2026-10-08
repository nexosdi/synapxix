import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import neo4j, { Driver, QueryResult } from 'neo4j-driver';
import Cypher, { Clause } from '@neo4j/cypher-builder';

@Injectable()
export class Neo4jService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(Neo4jService.name);
  private driver: Driver;

  async onModuleInit() {
    const uri = process.env.NEO4J_URI ?? 'neo4j://localhost:7687';
    const username = process.env.NEO4J_USERNAME ?? 'neo4j';
    const password = process.env.NEO4J_PASSWORD ?? 'neo4j';

    this.driver = neo4j.driver(uri, neo4j.auth.basic(username, password), {
      disableLosslessIntegers: true,
    });

    try {
      await this.driver.verifyConnectivity();
      this.logger.log('Successfully connected to Neo4j');
    } catch (error) {
      this.logger.error(`Failed to connect to Neo4j: ${error}`);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.driver.close();
    this.logger.log('Neo4j driver closed');
  }

  async healthcheck(): Promise<{ status: 'ok' | 'error'; message?: string }> {
    try {
      await this.driver.verifyConnectivity();
      return { status: 'ok' };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      return { status: 'error', message };
    }
  }

  async write(query: Clause): Promise<QueryResult> {
    return this.run(query, 'WRITE');
  }

  async read(query: Clause): Promise<QueryResult> {
    return this.run(query, 'READ');
  }

  private async run(query: Clause, mode: 'READ' | 'WRITE'): Promise<QueryResult> {
    const { cypher, params } = query.build();
    const session = this.driver.session({
      defaultAccessMode: mode === 'WRITE' ? neo4j.session.WRITE : neo4j.session.READ,
    });
    
    try {
      return await session.run(cypher, params);
    } catch (error) {
      this.logger.error(`Neo4j query failed: ${error}`);
      throw error;
    } finally {
      await session.close();
    }
  }

  raw<T>(cypher: string, params: T = {} as T): Clause {
    return new Cypher.Raw(() => [cypher, params as Record<string, unknown>]);
  }
}
