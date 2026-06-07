import { Injectable, BadRequestException } from '@nestjs/common';
import { AiProvider } from '../modules/research/providers/ai.provider';

@Injectable()
export class ExercisesService {
  constructor(private readonly aiProvider: AiProvider) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async evaluateAudio(expectedText: string, file: any) {
    if (!file) {
      throw new BadRequestException('Audio file is required');
    }

    if (!expectedText) {
      throw new BadRequestException('Expected text is required');
    }

    const base64Audio = file.buffer.toString('base64');
    const mimeType = file.mimetype || 'audio/webm';

    const result = await this.aiProvider.analyzeAudio(
      expectedText,
      mimeType,
      base64Audio,
    );

    try {
      // Parse the JSON string from Gemini (might be wrapped in markdown block)
      const cleanJson = result.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch {
      return {
        isCorrect: false,
        score: 0,
        feedback: "Could not parse AI response",
        rawResult: result
      };
    }
  }
}
