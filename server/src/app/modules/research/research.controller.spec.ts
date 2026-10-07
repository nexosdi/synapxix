import { Test, TestingModule } from '@nestjs/testing';
import { Response, Request } from 'express';
import { ResearchController } from './research.controller';
import { ResearchService } from './research.service';
import { ProcessGameActivityDto } from './models/game-input.model';
import { AiCacheInterceptor } from './interceptors/ai-cache.interceptor';

describe('ResearchController', () => {
  let controller: ResearchController;
  let service: ResearchService;

  // Creamos un Mock del ResearchService
  const mockResearchService = {
    processActivity: jest.fn(),
    processActivityStream: jest.fn(),
  };

  // Helpers para simular los objetos nativos de Express
  let mockResponse: Partial<Response>;
  let mockRequest: Partial<Request>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResearchController],
      providers: [
        {
          provide: ResearchService,
          useValue: mockResearchService,
        },
      ],
    })
      .overrideInterceptor(AiCacheInterceptor)
      .useValue({ intercept: jest.fn() })
      .compile();

    controller = module.get<ResearchController>(ResearchController);
    service = module.get<ResearchService>(ResearchService);

    // Reiniciamos los mocks de Express antes de cada test
    mockResponse = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      flushHeaders: jest.fn(),
      write: jest.fn(),
      end: jest.fn(),
    };

    mockRequest = {
      on: jest.fn(),
      off: jest.fn(),
    };

    jest.clearAllMocks();
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('process (Sync)', () => {
    it('debería procesar la actividad de forma síncrona', async () => {
      const dto = {} as ProcessGameActivityDto;
      const expectedResult = { analysis: 'success' };
      
      mockResearchService.processActivity.mockResolvedValue(expectedResult);

      const result = await controller.process(dto);

      expect(service.processActivity).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('processStream (SSE)', () => {
    // Función auxiliar para crear un stream falso que emita pedazos de texto
    async function* mockStreamGenerator(chunks: string[]) {
      for (const chunk of chunks) {
        yield chunk;
      }
    }

    it('debería configurar los headers correctos para SSE', async () => {
      const dto = {} as ProcessGameActivityDto;
      mockResearchService.processActivityStream.mockResolvedValue(mockStreamGenerator([]));

      await controller.processStream(dto, mockResponse as Response, mockRequest as Request);

      expect(mockResponse.setHeader).toHaveBeenCalledWith('Content-Type', 'text/event-stream');
      expect(mockResponse.setHeader).toHaveBeenCalledWith('Cache-Control', 'no-cache');
      expect(mockResponse.setHeader).toHaveBeenCalledWith('Connection', 'keep-alive');
      expect(mockResponse.setHeader).toHaveBeenCalledWith('X-Accel-Buffering', 'no');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.flushHeaders).toHaveBeenCalled();
    });

    it('debería emitir los chunks de texto y cerrar con DONE', async () => {
      const dto = {} as ProcessGameActivityDto;
      const streamChunks = ['Hola', ' ', 'Mundo'];
      
      mockResearchService.processActivityStream.mockResolvedValue(mockStreamGenerator(streamChunks));

      await controller.processStream(dto, mockResponse as Response, mockRequest as Request);

      // Verificamos que se escribieron los eventos en formato SSE
      expect(mockResponse.write).toHaveBeenCalledWith(`event: chunk\ndata: ${JSON.stringify({ text: 'Hola' })}\n\n`);
      expect(mockResponse.write).toHaveBeenCalledWith(`event: chunk\ndata: ${JSON.stringify({ text: ' ' })}\n\n`);
      expect(mockResponse.write).toHaveBeenCalledWith(`event: chunk\ndata: ${JSON.stringify({ text: 'Mundo' })}\n\n`);
      
      // Verificamos el evento de finalización
      expect(mockResponse.write).toHaveBeenCalledWith(`event: done\ndata: [DONE]\n\n`);
      expect(mockResponse.end).toHaveBeenCalled();
    });

    it('debería emitir un evento de error si el stream falla', async () => {
      const dto = {} as ProcessGameActivityDto;
      const errorMessage = 'Error en la IA';
      
      // Simulamos que la llamada al servicio lanza una excepción
      mockResearchService.processActivityStream.mockRejectedValue(new Error(errorMessage));

      await controller.processStream(dto, mockResponse as Response, mockRequest as Request);

      expect(mockResponse.write).toHaveBeenCalledWith(
        `event: error\ndata: ${JSON.stringify({ message: errorMessage })}\n\n`
      );
      expect(mockResponse.end).toHaveBeenCalled();
    });

    it('debería detener la emisión y abortar si el cliente cierra la conexión', async () => {
      const dto = {} as ProcessGameActivityDto;
      
      // Extraemos el callback onClose que el controlador registra. 
      // Se inicializa devolviendo undefined para evitar errores de ESLint (no-empty-function)
      let onCloseCallback: () => void = () => undefined;
      
      mockRequest.on = jest.fn().mockImplementation((event, callback) => {
        if (event === 'close') {
          onCloseCallback = callback;
        }
      });

      // Creamos un stream que se detenga a la mitad si onCloseCallback es llamado
      async function* interruptibleStream() {
        yield 'Parte 1';
        onCloseCallback(); // Simulamos que el usuario cerró el navegador aquí
        yield 'Parte 2';   // Esto no debería enviarse al Response
      }

      mockResearchService.processActivityStream.mockResolvedValue(interruptibleStream());

      await controller.processStream(dto, mockResponse as Response, mockRequest as Request);

      // Verificamos que se emitió el primer chunk
      expect(mockResponse.write).toHaveBeenCalledWith(`event: chunk\ndata: ${JSON.stringify({ text: 'Parte 1' })}\n\n`);
      
      // Verificamos que NO se emitió el segundo chunk ni el mensaje [DONE]
      expect(mockResponse.write).not.toHaveBeenCalledWith(expect.stringContaining('Parte 2'));
      expect(mockResponse.write).not.toHaveBeenCalledWith(`event: done\ndata: [DONE]\n\n`);
      
      // Verificamos que no intentó hacer res.end() porque la conexión ya se cerró
      expect(mockResponse.end).not.toHaveBeenCalled();
    });
  });
});