import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';
import { withRetry } from './retry.util';

/**
 * AiProvider — Central abstraction layer for AI model interactions.
 *
 * This provider wraps the Google Generative AI SDK (Gemini 2.5 Flash) and
 * isolates the business logic from the specific external API implementation.
 * It includes automatic retry with exponential backoff for transient errors
 * (HTTP 429, 500, 503) to improve resilience against rate limits and
 * temporary service outages.
 *
 * Dependencies:
 *   - ConfigService (from @nestjs/config) — reads the GOOGLE_GEN_AI_KEY
 *     environment variable and optional retry tuning variables.
 *     ConfigModule must be registered globally in AppModule with
 *     `ConfigModule.forRoot({ isGlobal: true })`.
 *
 * Environment variables (optional):
 *   - AI_MAX_RETRIES       — Number of retry attempts (default: 3)
 *   - AI_RETRY_BASE_DELAY_MS — Base delay in ms for exponential backoff (default: 1000)
 *
 * Usage:
 *   This provider is registered in ResearchModule and can be injected into
 *   any service within that module. To use it from another module, import
 *   ResearchModule or register AiProvider directly in your module's providers.
 *
 * @see ResearchModule — registers and uses this provider
 * @see ResearchService — consumes analyzePedagogicalAction()
 * @see ExercisesService — consumes analyzeAudio()
 */
@Injectable()
export class AiProvider {
  private readonly logger = new Logger(AiProvider.name);
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;

  /** Number of retry attempts for transient AI API errors. */
  private readonly maxRetries: number;

  /** Base delay (ms) for the first retry; subsequent delays grow exponentially. */
  private readonly baseDelayMs: number;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('GOOGLE_GEN_AI_KEY')?.trim();

    if (!apiKey) {
      this.logger.error('Google Generative AI API key is not set in environment variables.');
      throw new Error('Google Generative AI API key is not set');
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    // Read optional retry configuration from environment, with sensible defaults
    this.maxRetries = this.configService.get<number>('AI_MAX_RETRIES', 3);
    this.baseDelayMs = this.configService.get<number>('AI_RETRY_BASE_DELAY_MS', 1000);

    this.logger.log(
      `Initialized with model=gemini-2.5-flash, maxRetries=${this.maxRetries}, baseDelayMs=${this.baseDelayMs}`,
    );
  }

  /**
   * Analyzes a student's game activity using AI to generate pedagogical insights.
   *
   * The call to the Gemini API is wrapped in a retry mechanism that
   * automatically handles transient errors (429 rate limit, 500/503 server
   * errors) with exponential backoff.
   *
   * @param systemPrompt - Instructions that define the AI's role and analysis criteria
   * @param context      - Simplified description of the game activity being evaluated
   * @param studentInput - Raw student performance data (success, duration, content)
   * @returns AI-generated pedagogical analysis as a text string
   * @throws InternalServerErrorException if the AI returns an empty response
   *         or if all retry attempts are exhausted
   */
  async analyzePedagogicalAction(
    systemPrompt: string,
    context: string,
    studentInput: any
  ): Promise<string> {
    const prompt = `
      ${systemPrompt}
      
      GAME CONTEXT:
      ${context}
      
      STUDENT PERFORMANCE:
      ${JSON.stringify(studentInput)}
      
      TASK: Analyze the student's response based on the game context. 
      Identify strengths, weaknesses, and potential archetypes.
    `;

    try {
      const result = await withRetry(
        () => this.model.generateContent(prompt),
        { maxRetries: this.maxRetries, baseDelayMs: this.baseDelayMs },
        this.logger,
      );

      const text = result.response.text();

      // Guard against empty AI responses that would be useless downstream
      if (!text) {
        this.logger.error('AI returned empty response for analyzePedagogicalAction');
        throw new InternalServerErrorException('AI returned empty response');
      }

      return text;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // If the error was already wrapped as an HTTP exception, re-throw as-is
      if (error instanceof InternalServerErrorException) {
        throw error;
      }

      this.logger.error(
        `[analyzePedagogicalAction] Failed after retries: ${error.message}`,
      );
      throw new InternalServerErrorException(
        'Failed to generate pedagogical action analysis.',
      );
    }
  }

  /**
   * Analyzes an audio file alongside an expected text using Gemini's
   * multimodal capabilities.
   *
   * The call to the Gemini API is wrapped in a retry mechanism that
   * automatically handles transient errors (429, 500, 503).
   *
   * @param expectedText - The text the student was supposed to read
   * @param mimeType     - The MIME type of the audio file (e.g. 'audio/webm', 'audio/wav')
   * @param base64Audio  - The raw audio data encoded as a base64 string
   * @returns AI-generated evaluation as a JSON string
   * @throws InternalServerErrorException if the AI returns an empty response
   *         or if all retry attempts are exhausted
   */
  async analyzeAudio(
    expectedText: string,
    mimeType: string,
    base64Audio: string
  ): Promise<string> {
    const prompt = `
      You are an AI teacher evaluating a student's reading aloud exercise.
      The student was supposed to read the following text:
      "${expectedText}"
      
      Listen to the attached audio file of the student reading.
      Evaluate if they read the text correctly.
      Respond ONLY with a JSON object in the following format:
      {
        "isCorrect": boolean,
        "score": number, // 0 to 100
        "feedback": "Your pedagogical feedback here"
      }
    `;

    try {
      const result = await withRetry(
        () =>
          this.model.generateContent([
            prompt,
            {
              inlineData: {
                data: base64Audio,
                mimeType: mimeType,
              },
            },
          ]),
        { maxRetries: this.maxRetries, baseDelayMs: this.baseDelayMs },
        this.logger,
      );

      const text = result.response.text();

      // Guard against empty AI responses
      if (!text) {
        this.logger.error('AI returned empty response for analyzeAudio');
        throw new InternalServerErrorException('AI returned empty response');
      }

      return text;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      }

      this.logger.error(
        `[analyzeAudio] Failed after retries: ${error.message}`,
      );
      throw new InternalServerErrorException(
        'Failed to generate audio evaluation.',
      );
    }
  }
}