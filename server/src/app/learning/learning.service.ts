import { Injectable, Logger } from '@nestjs/common';
import {CreateTopicDto,CreateUserDto,InitMethodDto,MethodFeedbackDto,ReinforceTopicDto,SetPreferencesDto,} from '@nexosdi.synapxix/learning/shared';
import { QueryResult } from 'neo4j-driver';
import { Neo4jService } from './neo4j.service';

@Injectable()
export class LearningService {
  private readonly logger = new Logger(LearningService.name);

  constructor(private readonly neo4jService: Neo4jService) {}

  async bootstrapSchema(): Promise<{ constraints: number; catalogs: number }> {
    const constraintQueries = [
      this.neo4jService.raw(
        'CREATE CONSTRAINT user_id IF NOT EXISTS FOR (u:User) REQUIRE u.id IS UNIQUE'
      ),
      this.neo4jService.raw(
        'CREATE CONSTRAINT topic_id IF NOT EXISTS FOR (t:Topic) REQUIRE t.id IS UNIQUE'
      ),
      this.neo4jService.raw(
        'CREATE CONSTRAINT lp_key IF NOT EXISTS FOR (lp:LearnPref) REQUIRE lp.key IS UNIQUE'
      ),
      this.neo4jService.raw(
        'CREATE CONSTRAINT lm_key IF NOT EXISTS FOR (m:LearnMethod) REQUIRE m.key IS UNIQUE'
      ),
      this.neo4jService.raw(`CREATE VECTOR INDEX topic_vec IF NOT EXISTS
        FOR (t:Topic) ON (t.embedding)
        OPTIONS {indexConfig: {
          \`vector.dimensions\`: 768,
          \`vector.similarity_function\`: 'cosine'
        }}`),
    ];

    for (const query of constraintQueries) {
      await this.neo4jService.write(query);
    }

    const preferencesCatalog = this.neo4jService.raw(`
      UNWIND [
       {key:'linguistic',source:'Gardner',category:'intelligence'},
       {key:'logical_mathematical',source:'Gardner',category:'intelligence'},
       {key:'spatial',source:'Gardner',category:'intelligence'},
       {key:'bodily_kinesthetic',source:'Gardner',category:'intelligence'},
       {key:'musical',source:'Gardner',category:'intelligence'},
       {key:'interpersonal',source:'Gardner',category:'intelligence'},
       {key:'intrapersonal',source:'Gardner',category:'intelligence'},
       {key:'naturalistic',source:'Gardner',category:'intelligence'},
       {key:'diverging',source:'Kolb',category:'style'},
       {key:'assimilating',source:'Kolb',category:'style'},
       {key:'converging',source:'Kolb',category:'style'},
       {key:'accommodating',source:'Kolb',category:'style'}
      ] AS row
      MERGE (lp:LearnPref {key:row.key})
        SET lp.source=row.source,
            lp.category=row.category
    `);

    const methodsCatalog = this.neo4jService.raw(`
      UNWIND [
       {key:'visual_summary',        description:'Diagrams + key frames'},
       {key:'interactive_quiz',      description:'Short checks for understanding'},
       {key:'project_challenge',     description:'Build/apply to a mini-project'},
       {key:'guided_walkthrough',    description:'Step-by-step with hints'},
       {key:'audio_brief',           description:'Narrated TL;DR'},
       {key:'peer_discussion',       description:'Prompt for social reflection'}
      ] AS row
      MERGE (m:LearnMethod {key:row.key})
        SET m.description = row.description
    `);

    await this.neo4jService.write(preferencesCatalog);
    await this.neo4jService.write(methodsCatalog);

    return {
      constraints: constraintQueries.length,
      catalogs: 2,
    };
  }

  async createUser(dto: CreateUserDto) {
    const result = await this.neo4jService.write(
      this.neo4jService.raw(
        `
        MERGE (u:User {id:$userId})
          SET u.name = $name,
              u.embedding = CASE WHEN $embedding IS NULL THEN u.embedding ELSE $embedding END
        RETURN u
      `,
        {
          userId: dto.userId,
          name: dto.name,
          embedding: dto.embedding ?? null,
        }
      )
    );

    return this.unwrapNode(result, 'u');
  }

  async createTopic(dto: CreateTopicDto) {
    const result = await this.neo4jService.write(
      this.neo4jService.raw(
        `
        MERGE (u:User {id:$userId})
        MERGE (t:Topic {id:$topicId})
          SET t.userId = $userId,
              t.topicContent = $topicContent,
              t.embedding = CASE WHEN $topicVec IS NULL THEN t.embedding ELSE $topicVec END,
              t.uses = coalesce(t.uses,0)
        MERGE (u)-[:OWNS]->(t)
        MERGE (u)-[r:INTEREST_IN]->(t)
          SET r.weight = CASE WHEN coalesce(r.weight,0.0) + $initialWeight < 0.0 THEN 0.0 WHEN coalesce(r.weight,0.0) + $initialWeight > 1.0 THEN 1.0 ELSE coalesce(r.weight,0.0) + $initialWeight END
        RETURN t, r
      `,
        {
          userId: dto.userId,
          topicId: dto.topicId,
          topicContent: dto.topicContent,
          topicVec: dto.topicVec ?? null,
          initialWeight: dto.initialWeight ?? 0.0,
        }
      )
    );

    const record = result.records[0];
    return {
      topic: this.unwrapValue(record?.get('t')),
      interest: this.unwrapValue(record?.get('r')),
    };
  }

  async reinforceTopic(dto: ReinforceTopicDto) {
    const result = await this.neo4jService.write(
      this.neo4jService.raw(
        `
        MATCH (u:User {id:$userId})-[r:INTEREST_IN]->(t:Topic {id:$topicId})
        SET r.weight = CASE WHEN coalesce(r.weight,0)+$delta < 0.0 THEN 0.0 WHEN coalesce(r.weight,0)+$delta > 1.0 THEN 1.0 ELSE coalesce(r.weight,0)+$delta END
        SET t.uses   = coalesce(t.uses,0) + CASE WHEN $delta>0 THEN 1 ELSE 0 END
        RETURN t.id AS topicId, r.weight AS weight, t.uses AS uses
      `,
        dto
      )
    );

    return result.records[0]?.toObject();
  }

  async setPreferences(dto: SetPreferencesDto) {
    const result = await this.neo4jService.write(
      this.neo4jService.raw(
        `
        MATCH (u:User {id:$userId})
        UNWIND $prefKeys AS k
        MATCH (lp:LearnPref {key:k})
        MERGE (u)-[r:PREFERS]->(lp)
          SET r.weight = CASE WHEN coalesce(r.weight,0)+$initWeight < 0.0 THEN 0.0 WHEN coalesce(r.weight,0)+$initWeight > 1.0 THEN 1.0 ELSE coalesce(r.weight,0)+$initWeight END
        RETURN k AS prefKey, r.weight AS weight
      `,
        {
          userId: dto.userId,
          prefKeys: dto.prefKeys,
          initWeight: dto.initWeight ?? 0.5,
        }
      )
    );

    return result.records.map((record) => record.toObject());
  }

  async initMethod(dto: InitMethodDto) {
    const result = await this.neo4jService.write(
      this.neo4jService.raw(
        `
        MATCH (u:User {id:$userId})
        MATCH (m:LearnMethod {key:$methodKey})
        MERGE (u)-[r:BENEFITS_FROM]->(m)
          SET r.weight = CASE WHEN coalesce(r.weight,0)+$initWeight < 0.0 THEN 0.0 WHEN coalesce(r.weight,0)+$initWeight > 1.0 THEN 1.0 ELSE coalesce(r.weight,0)+$initWeight END
        RETURN m.key AS methodKey, r.weight AS weight
      `,
        {
          ...dto,
          initWeight: dto.initWeight ?? 0.5,
        }
      )
    );

    return result.records[0]?.toObject();
  }

  async reinforceMethod(dto: MethodFeedbackDto) {
    const result = await this.neo4jService.write(
      this.neo4jService.raw(
        `
        MATCH (u:User {id:$userId})-[r:BENEFITS_FROM]->(m:LearnMethod {key:$methodKey})
        SET r.weight = CASE WHEN coalesce(r.weight,0)+$delta < 0.0 THEN 0.0 WHEN coalesce(r.weight,0)+$delta > 1.0 THEN 1.0 ELSE coalesce(r.weight,0)+$delta END
        RETURN m.key AS methodKey, r.weight AS weight
      `,
        dto
      )
    );

    return result.records[0]?.toObject();
  }

  async topTopics(userId: string, limit = 10) {
    const result = await this.neo4jService.read(
      this.neo4jService.raw(
        `
        MATCH (u:User {id:$userId})-[r:INTEREST_IN]->(t:Topic)
        RETURN t.id AS topicId, t.topicContent AS content, r.weight AS weight, t.uses AS uses
        ORDER BY weight DESC, t.uses DESC
        LIMIT $limit
      `,
        { userId, limit }
      )
    );

    return result.records.map((record) => record.toObject());
  }

  async topPreferences(userId: string, limit = 10) {
    const result = await this.neo4jService.read(
      this.neo4jService.raw(
        `
        MATCH (u:User {id:$userId})-[r:PREFERS]->(lp:LearnPref)
        RETURN lp.key AS pref, lp.source AS source, r.weight AS weight
        ORDER BY weight DESC
        LIMIT $limit
      `,
        { userId, limit }
      )
    );

    return result.records.map((record) => record.toObject());
  }

  async topMethods(userId: string, limit = 10) {
    const result = await this.neo4jService.read(
      this.neo4jService.raw(
        `
        MATCH (u:User {id:$userId})-[r:BENEFITS_FROM]->(m:LearnMethod)
        RETURN m.key AS method, m.description AS description, r.weight AS weight
        ORDER BY weight DESC
        LIMIT $limit
      `,
        { userId, limit }
      )
    );

    return result.records.map((record) => record.toObject());
  }

  async refreshUserEmbedding(userId: string) {
    const result = await this.neo4jService.write(
      this.neo4jService.raw(
        `
        MATCH (u:User {id:$userId})-[r:INTEREST_IN]->(t:Topic)
        WITH u, collect({v:t.embedding, w:r.weight}) AS items
        WITH u,
             [x IN items WHERE x.v IS NOT NULL] AS filtered,
             reduce(den = 0.0, x IN items | den + coalesce(x.w,0)) AS z
        WITH u,
             reduce(sum = [], x IN filtered | apoc.ml.scaleVector(x.v, x.w)) AS weighted,
             CASE WHEN z=0 THEN 1 ELSE z END AS denom
        WITH u, apoc.ml.sumVectors(weighted) AS summed, denom
        SET u.embedding = CASE WHEN summed IS NULL THEN u.embedding ELSE apoc.ml.scaleVector(summed, 1.0/denom) END
        RETURN size(u.embedding) AS dims
      `,
        { userId }
      )
    );

    return result.records[0]?.toObject();
  }

  // Dual Write & Knowledge Graph endpoints
  
  async syncTopicPrerequisite(topicId: string, prerequisiteId: string) {
    await this.neo4jService.write(
      this.neo4jService.raw(`
        MERGE (t:Topic {id: $topicId})
        MERGE (req:Topic {id: $prerequisiteId})
        MERGE (t)-[:PREREQUISITE]->(req)
      `, { topicId, prerequisiteId })
    );
  }

  async syncUserProgress(userId: string, topicId: string, status: string, score: number) {
    await this.neo4jService.write(
      this.neo4jService.raw(`
        MERGE (u:User {id: $userId})
        MERGE (t:Topic {id: $topicId})
        MERGE (u)-[p:PROGRESS]->(t)
        SET p.status = $status, p.score = $score
      `, { userId, topicId, status, score })
    );
  }

  async getUserGraph(userId: string) {
    const result = await this.neo4jService.read(
      this.neo4jService.raw(`
        MATCH (u:User {id: $userId})-[p:PROGRESS]->(t:Topic)
        OPTIONAL MATCH (t)-[r:PREREQUISITE]->(req:Topic)
        RETURN t, p, r, req
      `, { userId })
    );
    return result.records.map((r) => r.toObject());
  }

  async getRecommendedPath(userId: string, limit = 3) {
    const result = await this.neo4jService.read(
      this.neo4jService.raw(`
        MATCH (target:Topic)
        WHERE NOT EXISTS {
          MATCH (u:User {id: $userId})-[p:PROGRESS]->(target)
          WHERE p.status = 'COMPLETED'
        }
        AND NOT EXISTS {
          MATCH (target)-[:PREREQUISITE]->(req:Topic)
          WHERE NOT EXISTS {
            MATCH (u:User {id: $userId})-[reqP:PROGRESS]->(req)
            WHERE reqP.status = 'COMPLETED'
          }
        }
        RETURN target
        LIMIT $limit
      `, { userId, limit })
    );
    return result.records.map((r) => r.toObject());
  }

  private unwrapNode(result: QueryResult, key: string) {
    const record = result.records[0];
    return this.unwrapValue(record?.get(key));
  }

  private unwrapValue<T = unknown>(value: unknown): T | undefined {
    if (!value) {
      return undefined;
    }

    if (
      typeof value === 'object' &&
      'properties' in (value as Record<string, unknown>)
    ) {
      return { ...(value as { properties: T }).properties };
    }

    return value as T;
  }
}
