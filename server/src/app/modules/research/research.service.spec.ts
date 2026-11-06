import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { ResearchService } from './research.service';
import { AiProvider } from './providers/ai.provider';
import { LearningService } from '../../learning/learning.service';
import { AiPromptService } from './services/ai-prompt.service';
import { ProcessGameActivityDto } from './models/game-input.model';

describe('ResearchService', () => {
  let service: ResearchService;

  // Creamos los Mocks de las dependencias
  const mockAiProvider = {
    analyzePedagogicalAction: jest.fn(),
    streamPedagogicalAction: jest.fn(),
  };

  const mockLearningService = {
    reinforceTopic: jest.fn(),
  };

  const mockAiPromptService = {
    getPrompt: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResearchService,
        { provide: AiProvider, useValue: mockAiProvider },
        { provide: LearningService, useValue: mockLearningService },
        { provide: AiPromptService, useValue: mockAiPromptService },
      ],
    }).compile();

    service = module.get<ResearchService>(ResearchService);

    // Silenciamos el Logger para mantener la consola de tests limpia cuando simulemos errores
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
    jest.clearAllMocks();
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('processActivity (Sync)', () => {
    const mockDto: ProcessGameActivityDto = {
      gameType: 'fill-in-the-blanks',
      studentId: 'user-123',
      gameInput: { sentence: 'El gato ___', answers: ['maulla'] },
      studentResult: { success: true, duration: 45, content: 'maulla' },
    };

    it('debería procesar la actividad, pedir el prompt, analizar y actualizar el grafo', async () => {
      // 1. Arrange
      const expectedPrompt = 'System Prompt Mocheado';
      const expectedAiResponse = 'El estudiante comprendió el concepto.';
      
      mockAiPromptService.getPrompt.mockResolvedValue(expectedPrompt);
      mockAiProvider.analyzePedagogicalAction.mockResolvedValue(expectedAiResponse);
      mockLearningService.reinforceTopic.mockResolvedValue(undefined);

      // 2. Act
      const result = await service.processActivity(mockDto);

      // 3. Assert
      expect(mockAiPromptService.getPrompt).toHaveBeenCalledWith(
        'fill-in-the-blanks', 
        'SYSTEM_ANALYSIS', 
        expect.any(String)
      );

      // Verifica que el contexto simplificado se haya armado bien
      const expectedContext = 'Sentence: El gato ___. User answers: maulla';
      expect(mockAiProvider.analyzePedagogicalAction).toHaveBeenCalledWith(
        expectedPrompt,
        expectedContext,
        mockDto.studentResult
      );

      expect(mockLearningService.reinforceTopic).toHaveBeenCalledWith({
        userId: 'user-123',
        topicId: 'fill-in-the-blanks',
        delta: 0.1 // Como success fue true, el delta esperado es 0.1
      });

      expect(result).toEqual({
        game: 'fill-in-the-blanks',
        studentId: 'user-123',
        aiFeedback: expectedAiResponse,
        analysisContext: `AI processing context: ${expectedContext}`,
        performanceSummary: {
          wasSuccessful: true,
          timeTaken: 45,
          inputAnalyzed: 'maulla',
        },
        dimensionUpdate: { logic: 0.9, creativity: 0.8, engagement: 0.8 }, // duration < 60 y success = true
      });
    });

    it('debería capturar el error si LearningService (Neo4j) falla, sin romper la ejecución', async () => {
      // Arrange
      mockAiPromptService.getPrompt.mockResolvedValue('prompt');
      mockAiProvider.analyzePedagogicalAction.mockResolvedValue('feedback');
      
      // Simulamos una caída de la base de datos de grafos
      mockLearningService.reinforceTopic.mockRejectedValue(new Error('Neo4j connection error'));

      // Act
      const result = await service.processActivity(mockDto);

      // Assert
      expect(result).toBeDefined(); // El método completó exitosamente devolviendo el objeto
      expect(Logger.prototype.error).toHaveBeenCalledWith('Failed to update graph: Neo4j connection error');
    });
  });

  describe('processActivityStream (SSE)', () => {
    it('debería resolver el prompt y el contexto, y retornar el generador del AiProvider', async () => {
      // Arrange
      const mockDto: ProcessGameActivityDto = {
        gameType: 'speak-about-photo',
        studentId: 'user-123',
        gameInput: { prompt: 'Describa la imagen', targetKeywords: ['perro', 'parque'] },
        studentResult: { success: false, duration: 120, content: 'Un animal en el pasto' },
      };
      
      const abortController = new AbortController();
      const expectedPrompt = 'Streaming Prompt';
      
      // Creamos un falso generador asíncrono
      async function* fakeStream() { yield 'chunk1'; }
      const streamInstance = fakeStream();

      mockAiPromptService.getPrompt.mockResolvedValue(expectedPrompt);
      mockAiProvider.streamPedagogicalAction.mockResolvedValue(streamInstance);

      // Act
      const result = await service.processActivityStream(mockDto, abortController.signal);

      // Assert
      const expectedContext = 'Prompt: Describa la imagen. Keywords: perro, parque';
      
      expect(mockAiPromptService.getPrompt).toHaveBeenCalledWith(
        'speak-about-photo',
        'SYSTEM_ANALYSIS',
        expect.any(String)
      );

      expect(mockAiProvider.streamPedagogicalAction).toHaveBeenCalledWith(
        expectedPrompt,
        expectedContext,
        mockDto.studentResult,
        abortController.signal
      );

      expect(result).toBe(streamInstance);
    });
  });
});