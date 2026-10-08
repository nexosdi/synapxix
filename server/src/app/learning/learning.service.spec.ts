import { Test, TestingModule } from '@nestjs/testing';
import { LearningService } from './learning.service';
import { Neo4jService } from './neo4j.service';
import { CreateUserDto, CreateTopicDto } from '@nexosdi.synapxix/learning/shared';

describe('LearningService', () => {
  let service: LearningService;

  const mockNeo4jService = {
    write: jest.fn(),
    read: jest.fn(),
    raw: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LearningService,
        {
          provide: Neo4jService,
          useValue: mockNeo4jService,
        },
      ],
    }).compile();

    service = module.get<LearningService>(LearningService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Happy Path (Ruta feliz)', () => {
    it('debe crear un usuario exitosamente en Neo4j', async () => {
      const userDto: CreateUserDto = { userId: 'user-123', name: 'Fernando' };
      
      mockNeo4jService.write.mockResolvedValue({ records: [{ get: () => 'created', toObject: () => ({}) }] });
      mockNeo4jService.raw.mockReturnValue({});

      await service.createUser(userDto);
      expect(mockNeo4jService.write).toHaveBeenCalled();
    });

    it('debe obtener los top topics exitosamente', async () => {
      mockNeo4jService.read.mockResolvedValue({ records: [] });
      mockNeo4jService.raw.mockReturnValue({});

      const result = await service.topTopics('user-123', 10);
      expect(mockNeo4jService.read).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('Error Path (Ruta de error)', () => {
    it('debe manejar errores cuando Neo4j falla al escribir', async () => {
      const topicDto: CreateTopicDto = { userId: 'user-123', topicId: 'T1', topicContent: 'NestJS' };
      
      mockNeo4jService.write.mockRejectedValue(new Error('Write error'));
      mockNeo4jService.raw.mockReturnValue({});

      await expect(service.createTopic(topicDto)).rejects.toThrow('Write error');
    });

    it('debe manejar errores de conexión al leer de Neo4j', async () => {
      mockNeo4jService.read.mockRejectedValue(new Error('Neo4j connection error'));
      mockNeo4jService.raw.mockReturnValue({});

      await expect(service.topTopics('user-123', 5)).rejects.toThrow('Neo4j connection error');
    });
  });
});