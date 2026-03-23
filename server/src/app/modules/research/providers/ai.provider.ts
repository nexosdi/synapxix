import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AiProvider {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(private configService: ConfigService) {
  const apiKey = (this.configService.get<string>('GOOGLE_GEN_AI_KEY') || '').replace(/['" ]/g, '');    const cleanKey = apiKey?.replace(/['" ]/g, '') || '';
    
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
    } catch (error) {
      console.error('Gemini AI Provider Error:', error);
      return 'Error generating pedagogical analysis.';
    }
  }
}