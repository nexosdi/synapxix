import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';

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