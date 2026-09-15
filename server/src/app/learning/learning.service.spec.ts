import { Test, TestingModule } from '@nestjs/testing';
import { LearningService, NEO4J_DRIVER } from './learning.service';
import { CreateUserDto, CreateTopicDto } from '@nexosdi.synapxix/learning/shared';

describe('LearningService', () => {
  let service: LearningService;

  // Mock de la sesión que abre tu servicio internamente
  const mockSession = {
    run: jest.fn(),
    close: jest.fn(),
  };

  // Mock del Driver principal
  const mockNeo4jDriver = {
    session: jest.fn().mockReturnValue(mockSession),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LearningService,
        {
          provide: NEO4J_DRIVER, // <-- Acá está la clave, usando tu Symbol real
          useValue: mockNeo4jDriver,
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
      
      mockSession.run.mockResolvedValue({ records: [{ get: () => 'created' }] });

      await service.createUser(userDto);
      expect(mockNeo4jDriver.session).toHaveBeenCalled();
      expect(mockSession.run).toHaveBeenCalled();
    });

    it('debe obtener los top topics exitosamente', async () => {
      mockSession.run.mockResolvedValue({ records: [] });

      const result = await service.topTopics('user-123', 10);
      expect(mockSession.run).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('Error Path (Ruta de error)', () => {
    it('debe manejar errores cuando Neo4j falla al escribir', async () => {
      const topicDto: CreateTopicDto = { userId: 'user-123', topicId: 'T1', topicContent: 'NestJS' };
      
      mockSession.run.mockRejectedValue(new Error('Write error'));

      await expect(service.createTopic(topicDto)).rejects.toThrow('Write error');
    });

    it('debe manejar errores de conexión al leer de Neo4j', async () => {
      mockSession.run.mockRejectedValue(new Error('Neo4j connection error'));

      await expect(service.topTopics('user-123', 5)).rejects.toThrow('Neo4j connection error');
    });
  });
});