import { InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AiProvider } from './ai.provider';

/**
 * Unit tests for the AiProvider class.
 *
 * The Google Generative AI SDK is fully mocked — no real API key or network
 * calls are required. This allows the CI pipeline to run these tests without
 * any secrets configured.
 *
 * Mock strategy:
 *   - `@google/generative-ai` is replaced with a factory that exposes
 *     a controllable `mockGenerateContent` jest function.
 *   - `ConfigService` is stubbed to return a fake API key and default retry values.
 *   - `withRetry` internals are NOT mocked — the retry utility is exercised
 *     end-to-end through the AiProvider to verify integration.
 */

// ---------------------------------------------------------------------------
// Mock setup — must be declared before any imports that reference the module
// ---------------------------------------------------------------------------

const mockGenerateContent = jest.fn();
const mockGenerateContentStream = jest.fn();

jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn().mockReturnValue({
      generateContent: mockGenerateContent,
      generateContentStream: mockGenerateContentStream,
    }),
  })),
}));

// Use fake timers so retry delays don't slow down tests
jest.useFakeTimers();

/**
 * Helper to create a mock async iterable stream from an array of text chunks.
 * Simulates the Google Generative AI SDK's streaming response shape.
 */
function createMockStream(chunks: string[]) {
  return {
    stream: (async function* () {
      for (const text of chunks) {
        yield { text: () => text };
      }
    })(),
  };
}

describe('AiProvider', () => {
  let provider: AiProvider;
  let configService: ConfigService;
  let aiPromptService: any;

  /**
   * Build a fresh AiProvider before each test, with a stubbed ConfigService
   * that provides a fake API key and default retry configuration.
   */
  beforeEach(() => {
    jest.clearAllMocks();

    configService = {
      get: jest.fn((key: string, defaultValue?: unknown) => {
        const config: Record<string, unknown> = {
          GOOGLE_GEN_AI_KEY: 'test-api-key-12345',
          AI_MAX_RETRIES: 3,
          AI_RETRY_BASE_DELAY_MS: 100, // Keep low for fast tests
        };
        return config[key] ?? defaultValue;
      }),
    } as unknown as ConfigService;

    aiPromptService = {
      getPrompt: jest.fn().mockImplementation((gameType, cat, defaultPrompt) => {
        if (cat === 'AUDIO_EVALUATION') {
          return `{"isCorrect": true}`; // Simple mock for testing
        }
        return defaultPrompt;
      }),
      invalidatePromptCache: jest.fn(),
    };

    provider = new AiProvider(configService, aiPromptService);
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Constructor tests
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * The provider must throw during construction if the API key is missing,
   * since it cannot function without one.
   */
  it('should throw if API key is missing', () => {
    const badConfig = {
      get: jest.fn((key: string) => {
        if (key === 'GOOGLE_GEN_AI_KEY') return undefined;
        return undefined;
      }),
    } as unknown as ConfigService;

    expect(() => new AiProvider(badConfig, aiPromptService)).toThrow(
      'Google Generative AI API key is not set',
    );
  });

  // ─────────────────────────────────────────────────────────────────────────
  // analyzePedagogicalAction tests
  // ─────────────────────────────────────────────────────────────────────────

  describe('analyzePedagogicalAction', () => {
    /**
     * Happy path: Gemini returns a valid text response on the first call.
     */
    it('should generate pedagogical analysis successfully', async () => {
      const mockResponse = {
        response: {
          text: () => 'The student shows strong logical reasoning skills.',
        },
      };
      mockGenerateContent.mockResolvedValue(mockResponse);

      const result = await provider.analyzePedagogicalAction(
        'Analyze this activity',
        'Fill in the blanks exercise',
        { success: true, duration: 45, content: 'hello world' },
      );

      expect(result).toBe('The student shows strong logical reasoning skills.');
      expect(mockGenerateContent).toHaveBeenCalledTimes(1);
    });

    /**
     * When the AI returns an empty string, the provider should throw
     * InternalServerErrorException to prevent downstream consumers
     * from receiving useless data.
     */
    it('should throw on empty AI response', async () => {
      const emptyResponse = { response: { text: () => '' } };
      mockGenerateContent.mockResolvedValue(emptyResponse);

      await expect(
        provider.analyzePedagogicalAction(
          'Analyze this',
          'context',
          { success: true },
        ),
      ).rejects.toThrow(InternalServerErrorException);
    });

    /**
     * A transient 429 error on the first attempt should trigger a retry.
     * The second attempt succeeds, so the overall call should succeed.
     */
    it('should retry on 429 and succeed', async () => {
      const rateLimitError = { status: 429, message: 'Too Many Requests' };
      const successResponse = {
        response: { text: () => 'Analysis complete after retry' },
      };

      mockGenerateContent
        .mockRejectedValueOnce(rateLimitError)
        .mockResolvedValue(successResponse);

      const resultPromise = provider.analyzePedagogicalAction(
        'Analyze',
        'ctx',
        { success: true },
      );

      // Flush the retry delay timer
      await jest.runAllTimersAsync();
      const result = await resultPromise;

      expect(result).toBe('Analysis complete after retry');
      expect(mockGenerateContent).toHaveBeenCalledTimes(2);
    });

    /**
     * A transient 500 error should also trigger a retry (same as 429).
     */
    it('should retry on 500 and succeed', async () => {
      const serverError = { status: 500, message: 'Internal Server Error' };
      const successResponse = {
        response: { text: () => 'Recovered from 500' },
      };

      mockGenerateContent
        .mockRejectedValueOnce(serverError)
        .mockResolvedValue(successResponse);

      const resultPromise = provider.analyzePedagogicalAction(
        'Analyze',
        'ctx',
        { success: true },
      );

      await jest.runAllTimersAsync();
      const result = await resultPromise;

      expect(result).toBe('Recovered from 500');
      expect(mockGenerateContent).toHaveBeenCalledTimes(2);
    });

    /**
     * When the 429 error persists across all retries, the provider should
     * throw InternalServerErrorException after exhausting attempts.
     */
    it('should exhaust retries and throw on persistent 429', async () => {
      const rateLimitError = { status: 429, message: 'Too Many Requests' };
      mockGenerateContent.mockRejectedValue(rateLimitError);

      let caughtError: unknown;
      const resultPromise = provider
        .analyzePedagogicalAction('Analyze', 'ctx', { success: true })
        .catch((err) => {
          caughtError = err;
        });

      await jest.runAllTimersAsync();
      await resultPromise;

      expect(caughtError).toBeInstanceOf(InternalServerErrorException);
      // 1 initial + 3 retries = 4 total calls
      expect(mockGenerateContent).toHaveBeenCalledTimes(4);
    });

    /**
     * A 401 Unauthorized error is NOT retryable — it should fail immediately
     * without any retry attempts.
     */
    it('should not retry on 401 errors', async () => {
      const authError = { status: 401, message: 'Unauthorized' };
      mockGenerateContent.mockRejectedValue(authError);

      await expect(
        provider.analyzePedagogicalAction('Analyze', 'ctx', { success: true }),
      ).rejects.toThrow(InternalServerErrorException);

      // Only 1 call — no retries for non-retryable status codes
      expect(mockGenerateContent).toHaveBeenCalledTimes(1);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // analyzeAudio tests
  // ─────────────────────────────────────────────────────────────────────────

  describe('analyzeAudio', () => {
    /**
     * Happy path for the multimodal audio analysis endpoint.
     */
    it('should generate audio evaluation successfully', async () => {
      const mockResponse = {
        response: {
          text: () =>
            '{"isCorrect": true, "score": 85, "feedback": "Great pronunciation!"}',
        },
      };
      mockGenerateContent.mockResolvedValue(mockResponse);

      const result = await provider.analyzeAudio(
        'Hello world',
        'audio/webm',
        'base64audiodatahere',
      );

      expect(result).toBe(
        '{"isCorrect": true, "score": 85, "feedback": "Great pronunciation!"}',
      );
      expect(mockGenerateContent).toHaveBeenCalledTimes(1);

      // Verify multimodal payload structure (prompt + inlineData)
      const callArgs = mockGenerateContent.mock.calls[0][0];
      expect(callArgs).toHaveLength(2);
      expect(callArgs[1]).toEqual({
        inlineData: {
          data: 'base64audiodatahere',
          mimeType: 'audio/webm',
        },
      });
    });

    /**
     * Empty audio response should throw — mirrors the analyzePedagogicalAction
     * behaviour for consistency.
     */
    it('should throw on empty AI response for audio', async () => {
      const emptyResponse = { response: { text: () => '' } };
      mockGenerateContent.mockResolvedValue(emptyResponse);

      await expect(
        provider.analyzeAudio('Hello', 'audio/webm', 'data'),
      ).rejects.toThrow(InternalServerErrorException);
    });

    /**
     * Retry behaviour for analyzeAudio should mirror analyzePedagogicalAction.
     */
    it('should retry on 429 for audio and succeed', async () => {
      const rateLimitError = { status: 429, message: 'Rate limited' };
      const successResponse = {
        response: {
          text: () => '{"isCorrect": true, "score": 90, "feedback": "Good"}',
        },
      };

      mockGenerateContent
        .mockRejectedValueOnce(rateLimitError)
        .mockResolvedValue(successResponse);

      const resultPromise = provider.analyzeAudio(
        'Hello',
        'audio/webm',
        'data',
      );

      await jest.runAllTimersAsync();
      const result = await resultPromise;

      expect(result).toContain('"isCorrect": true');
      expect(mockGenerateContent).toHaveBeenCalledTimes(2);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // streamPedagogicalAction tests
  // ─────────────────────────────────────────────────────────────────────────

  describe('streamPedagogicalAction', () => {
    /**
     * Happy path: the stream produces multiple text chunks that are
     * yielded one by one through the AsyncGenerator.
     */
    it('should stream pedagogical analysis chunks', async () => {
      const mockStream = createMockStream([
        'The student ',
        'shows strong ',
        'logical reasoning.',
      ]);
      mockGenerateContentStream.mockResolvedValue(mockStream);

      const chunks: string[] = [];
      for await (const chunk of provider.streamPedagogicalAction(
        'Analyze this activity',
        'Fill in the blanks',
        { success: true, duration: 45 },
      )) {
        chunks.push(chunk);
      }

      expect(chunks).toEqual([
        'The student ',
        'shows strong ',
        'logical reasoning.',
      ]);
      expect(mockGenerateContentStream).toHaveBeenCalledTimes(1);
    });

    /**
     * When the stream produces no text chunks, the provider should throw
     * InternalServerErrorException.
     */
    it('should throw on empty stream', async () => {
      const mockStream = createMockStream([]);
      mockGenerateContentStream.mockResolvedValue(mockStream);

      const chunks: string[] = [];
      let caughtError: unknown;

      try {
        for await (const chunk of provider.streamPedagogicalAction(
          'Analyze',
          'ctx',
          { success: true },
        )) {
          chunks.push(chunk);
        }
      } catch (error) {
        caughtError = error;
      }

      expect(chunks).toEqual([]);
      expect(caughtError).toBeInstanceOf(InternalServerErrorException);
    });

    /**
     * A transient 429 on the initial stream connection should trigger retry.
     * Once the stream is established on the second attempt, chunks flow normally.
     */
    it('should retry on 429 during stream connection and succeed', async () => {
      const rateLimitError = { status: 429, message: 'Too Many Requests' };
      const mockStream = createMockStream(['Recovered ', 'stream.']);

      mockGenerateContentStream
        .mockRejectedValueOnce(rateLimitError)
        .mockResolvedValue(mockStream);

      const chunks: string[] = [];
      const streamPromise = (async () => {
        for await (const chunk of provider.streamPedagogicalAction(
          'Analyze',
          'ctx',
          { success: true },
        )) {
          chunks.push(chunk);
        }
      })();

      await jest.runAllTimersAsync();
      await streamPromise;

      expect(chunks).toEqual(['Recovered ', 'stream.']);
      expect(mockGenerateContentStream).toHaveBeenCalledTimes(2);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // streamAudio tests
  // ─────────────────────────────────────────────────────────────────────────

  describe('streamAudio', () => {
    /**
     * Happy path for streaming multimodal audio analysis.
     */
    it('should stream audio evaluation chunks', async () => {
      const mockStream = createMockStream([
        '{"isCorrect": true, ',
        '"score": 85, ',
        '"feedback": "Great!"}',
      ]);
      mockGenerateContentStream.mockResolvedValue(mockStream);

      const chunks: string[] = [];
      for await (const chunk of provider.streamAudio(
        'Hello world',
        'audio/webm',
        'base64audiodata',
      )) {
        chunks.push(chunk);
      }

      expect(chunks).toEqual([
        '{"isCorrect": true, ',
        '"score": 85, ',
        '"feedback": "Great!"}',
      ]);
      expect(mockGenerateContentStream).toHaveBeenCalledTimes(1);

      // Verify multimodal payload structure
      const callArgs = mockGenerateContentStream.mock.calls[0][0];
      expect(callArgs).toHaveLength(2);
      expect(callArgs[1]).toEqual({
        inlineData: {
          data: 'base64audiodata',
          mimeType: 'audio/webm',
        },
      });
    });

    /**
     * Empty audio stream should throw InternalServerErrorException.
     */
    it('should throw on empty audio stream', async () => {
      const mockStream = createMockStream([]);
      mockGenerateContentStream.mockResolvedValue(mockStream);

      let caughtError: unknown;

      try {
        for await (const _chunk of provider.streamAudio(
          'Hello',
          'audio/webm',
          'data',
        )) {
          // consume
        }
      } catch (error) {
        caughtError = error;
      }

      expect(caughtError).toBeInstanceOf(InternalServerErrorException);
    });

    /**
     * Retry on 429 for audio stream connection.
     */
    it('should retry on 429 during audio stream connection', async () => {
      const rateLimitError = { status: 429, message: 'Rate limited' };
      const mockStream = createMockStream(['{"isCorrect": true}']);

      mockGenerateContentStream
        .mockRejectedValueOnce(rateLimitError)
        .mockResolvedValue(mockStream);

      const chunks: string[] = [];
      const streamPromise = (async () => {
        for await (const chunk of provider.streamAudio(
          'Hello',
          'audio/webm',
          'data',
        )) {
          chunks.push(chunk);
        }
      })();

      await jest.runAllTimersAsync();
      await streamPromise;

      expect(chunks).toEqual(['{"isCorrect": true}']);
      expect(mockGenerateContentStream).toHaveBeenCalledTimes(2);
    });
  });
});
