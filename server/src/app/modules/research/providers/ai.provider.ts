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

  /**
   * Analyzes an audio file alongside an expected text using Gemini's multimodal capabilities.
   *
   * @param expectedText - The text the student was supposed to read
   * @param mimeType - The MIME type of the audio file (e.g. 'audio/webm', 'audio/wav')
   * @param base64Audio - The raw audio data encoded as a base64 string
   * @returns AI-generated evaluation as a JSON string
   * @throws InternalServerErrorException if the AI API call fails
   */
  async analyzeAudio(
    expectedText: string,
    mimeType: string,
    base64Audio: string
  ): Promise<string> {
    try {
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

      const result = await this.model.generateContent([
        prompt,
        {
          inlineData: {
            data: base64Audio,
            mimeType: mimeType
          }
        }
      ]);
      const response = await result.response;
      
      return response.text();
    } catch (error: any) {
      this.logger.error(`Gemini AI Audio Provider Error: ${error.message}`);
      throw new InternalServerErrorException('Failed to generate audio evaluation.');
    }
  }
}