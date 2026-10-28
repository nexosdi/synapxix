import { Test, TestingModule } from '@nestjs/testing';
import { AiProvider } from './ai.provider';
import { ConfigService } from '@nestjs/config';
import { AiPromptService } from '../services/ai-prompt.service';
import { AI_ADAPTER_TOKEN } from './ai-adapter.provider';
import { InternalServerErrorException } from '@nestjs/common';

describe('AiProvider', () => {
  let provider: AiProvider;
  let adapterMock: any;
  let configServiceMock: any;
  let promptServiceMock: any;

  beforeEach(async () => {
    adapterMock = {
      generateContent: jest.fn(),
      generateContentStream: jest.fn(),
    };

    configServiceMock = {
      get: jest.fn((key) => {
        if (key === 'AI_MAX_RETRIES') return 0;
        if (key === 'AI_RETRY_BASE_DELAY_MS') return 0;
        return undefined;
      }),
    };

    promptServiceMock = {
      getPrompt: jest.fn().mockResolvedValue('Mocked System Prompt: {EXPECTED_TEXT}'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiProvider,
        { provide: ConfigService, useValue: configServiceMock },
        { provide: AiPromptService, useValue: promptServiceMock },
        { provide: AI_ADAPTER_TOKEN, useValue: adapterMock },
      ],
    }).compile();

    provider = module.get<AiProvider>(AiProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  describe('analyzePedagogicalAction', () => {
    it('should call adapter.generateContent and return text', async () => {
      adapterMock.generateContent.mockResolvedValue({
        text: () => 'Analysis result',
      });

      const result = await provider.analyzePedagogicalAction(
        'System prompt',
        'Game context',
        { score: 10 }
      );

      expect(result).toBe('Analysis result');
      expect(adapterMock.generateContent).toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException if adapter returns empty text', async () => {
      adapterMock.generateContent.mockResolvedValue({
        text: () => '',
      });

      await expect(
        provider.analyzePedagogicalAction('S', 'C', {})
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('analyzeAudio', () => {
    it('should call adapter.generateContent with text and inlineData', async () => {
      adapterMock.generateContent.mockResolvedValue({
        text: () => 'Audio evaluation',
      });

      const result = await provider.analyzeAudio(
        'Read this',
        'audio/webm',
        'base64AudioData'
      );

      expect(result).toBe('Audio evaluation');
      expect(adapterMock.generateContent).toHaveBeenCalledWith([
        { type: 'text', text: 'Mocked System Prompt: Read this' },
        {
          type: 'inlineData',
          data: 'base64AudioData',
          mimeType: 'audio/webm',
        },
      ]);
    });
  });

  describe('streaming methods', () => {
    it('should yield chunks for streamPedagogicalAction', async () => {
      adapterMock.generateContentStream.mockReturnValue((async function* () {
        yield 'chunk1';
        yield 'chunk2';
      })());

      const generator = provider.streamPedagogicalAction('S', 'C', {});
      const chunks = [];
      for await (const chunk of generator) {
        chunks.push(chunk);
      }

      expect(chunks).toEqual(['chunk1', 'chunk2']);
      expect(adapterMock.generateContentStream).toHaveBeenCalled();
    });
  });
});
