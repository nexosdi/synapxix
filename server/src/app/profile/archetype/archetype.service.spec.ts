import { Test, TestingModule } from '@nestjs/testing';
import { ArchetypeService } from './archetype.service';
import { PrismaService } from '@nexosdi.synapxix/prisma';

describe('ArchetypeService', () => {
  let service: ArchetypeService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArchetypeService,
        {
          provide: PrismaService,
          useValue: {
            cognitiveMetric: {
              findMany: jest.fn(),
            },
            archetype: {
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ArchetypeService>(ArchetypeService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('calculateArchetype', () => {
    it('should return insufficient_data if less than 3 sessions', async () => {
      jest.spyOn(prisma.cognitiveMetric, 'findMany').mockResolvedValue([
        { metric_id: '1', accuracy: 1, reaction_time: 1000, cognitive_load: 50, memory_retention: 0.8, attention_span: 0.9, session_id: 's1', user_id: 'u1', created_at: new Date() },
      ]);

      const result = await service.calculateArchetype('u1');
      expect(result.status).toBe('insufficient_data');
      expect(result.sessionCount).toBe(1);
    });

    it('should calculate dominant archetype correctly', async () => {
      // Mock 3 sessions
      jest.spyOn(prisma.cognitiveMetric, 'findMany').mockResolvedValue([
        { metric_id: '1', accuracy: 0.9, reaction_time: 1500, cognitive_load: 20, memory_retention: 0.8, attention_span: 0.9, session_id: 's1', user_id: 'u1', created_at: new Date() },
        { metric_id: '2', accuracy: 0.95, reaction_time: 1200, cognitive_load: 10, memory_retention: 0.85, attention_span: 0.85, session_id: 's2', user_id: 'u1', created_at: new Date() },
        { metric_id: '3', accuracy: 0.85, reaction_time: 1800, cognitive_load: 30, memory_retention: 0.75, attention_span: 0.95, session_id: 's3', user_id: 'u1', created_at: new Date() },
      ]);

      // Mock archetypes and weights
      jest.spyOn(prisma.archetype, 'findMany').mockResolvedValue([
        {
          archetype_id: 'a1',
          name: 'Analítico',
          description: 'Desc',
          dimension_id: null,
          weights: [
            { weight: 0.8, dimension: { name: 'Lógica' } },
            { weight: 0.2, dimension: { name: 'Velocidad' } },
          ],
        },
        {
          archetype_id: 'a2',
          name: 'Creativo',
          description: 'Desc',
          dimension_id: null,
          weights: [
            { weight: 0.1, dimension: { name: 'Lógica' } },
            { weight: 0.9, dimension: { name: 'Creatividad' } },
          ],
        }
      ] as any);

      const result = await service.calculateArchetype('u1');
      expect(result.status).toBe('calculated');
      // Promedios: accuracy = 0.9, reaction = 1500, load = 20
      // Lógica = 0.9
      // Velocidad = 1 - (1500/5000) = 0.7
      // Creatividad = 1 - (20/100) = 0.8
      // Score Analítico = (0.8 * 0.9) + (0.2 * 0.7) = 0.72 + 0.14 = 0.86
      // Score Creativo = (0.1 * 0.9) + (0.9 * 0.8) = 0.09 + 0.72 = 0.81
      expect(result.archetype?.name).toBe('Analítico');
      expect(result.sessionCount).toBe(3);
    });
    
    it('should handle null values in metrics', async () => {
      // Mock 3 sessions with nulls
      jest.spyOn(prisma.cognitiveMetric, 'findMany').mockResolvedValue([
        { metric_id: '1', accuracy: 0.8, reaction_time: null, cognitive_load: 50, memory_retention: null, attention_span: null, session_id: 's1', user_id: 'u1', created_at: new Date() },
        { metric_id: '2', accuracy: 0.8, reaction_time: null, cognitive_load: 50, memory_retention: null, attention_span: null, session_id: 's2', user_id: 'u1', created_at: new Date() },
        { metric_id: '3', accuracy: 0.8, reaction_time: null, cognitive_load: 50, memory_retention: null, attention_span: null, session_id: 's3', user_id: 'u1', created_at: new Date() },
      ]);

      jest.spyOn(prisma.archetype, 'findMany').mockResolvedValue([
        {
          archetype_id: 'a1',
          name: 'Test',
          description: 'Desc',
          dimension_id: null,
          weights: [
            { weight: 1.0, dimension: { name: 'Memoria' } },
          ],
        }
      ] as any);

      const result = await service.calculateArchetype('u1');
      
      // Fallback for memory should be 0.5
      expect(result.dimensions['Memoria']).toBe(0.5);
    });
  });
});
