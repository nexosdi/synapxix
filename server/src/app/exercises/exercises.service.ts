import { Injectable } from '@nestjs/common';
import { AiProvider } from '../modules/research/providers/ai.provider';
import { EvaluateReadAloudDto } from './dto/evaluate-read-aloud.dto';
import { UploadedAudioFile } from './types/uploaded-audio-file';

@Injectable()
export class ExercisesService {
  constructor(private readonly aiProvider: AiProvider) {}

  async evaluateAudio(dto: EvaluateReadAloudDto, file: UploadedAudioFile) {
    const base64Audio = file.buffer.toString('base64');
    const mimeType = file.mimetype;

    const result = await this.aiProvider.analyzeAudio(
      dto.expectedText,
      mimeType,
      base64Audio,
    );

    try {
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
