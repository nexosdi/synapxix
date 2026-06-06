import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';

/**
 * AiProvider — Central abstraction layer for AI model interactions.
 *
 * This provider wraps the Google Generative AI SDK (Gemini 2.5 Flash) and
 * isolates the business logic from the specific external API implementation.
 *
 * Dependencies:
 *   - ConfigService (from @nestjs/config) — reads the GOOGLE_GEN_AI_KEY
 *     environment variable. ConfigModule must be registered globally in
 *     AppModule with `ConfigModule.forRoot({ isGlobal: true })`.
 *
 * Usage:
 *   This provider is registered in ResearchModule and can be injected into
 *   any service within that module. To use it from another module, import
 *   ResearchModule or register AiProvider directly in your module's providers.
 *
 * @see ResearchModule — registers and uses this provider
 * @see ResearchService — consumes analyzePedagogicalAction()
 */
@Injectable()
export class AiProvider {
  private readonly logger = new Logger(AiProvider.name);
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel; 

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
  }

  /**
   * Analyzes a student's game activity using AI to generate pedagogical insights.
   *
   * @param systemPrompt - Instructions that define the AI's role and analysis criteria
   * @param context - Simplified description of the game activity being evaluated
   * @param studentInput - Raw student performance data (success, duration, content)
   * @returns AI-generated pedagogical analysis as a text string
   * @throws InternalServerErrorException if the AI API call fails
   */
  async analyzePedagogicalAction(
    systemPrompt: string, 
    context: string, 
    studentInput: any
  ): Promise<string> {
    try {
      const prompt = `
        ${systemPrompt}
        
        GAME CONTEXT:
        ${context}
        
        STUDENT PERFORMANCE:
        ${JSON.stringify(studentInput)}
        
        TASK: Analyze the student's response based on the game context. 
        Identify strengths, weaknesses, and potential archetypes.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      
      return response.text();
    } catch (error: any) {
      this.logger.error(`Gemini AI Provider Error: ${error.message}`);
      throw new InternalServerErrorException('Failed to generate pedagogical action analysis.');
    }
  }
}