import { Injectable } from '@nestjs/common';
import { AiProvider } from '../modules/research/providers/ai.provider';
import { EvaluateCategorizationDto } from './dto/evaluate-categorization.dto';
import { EvaluateFillInTheBlanksDto } from './dto/evaluate-fill-in-the-blanks.dto';
import { EvaluateIntruderDto } from './dto/evaluate-intruder.dto';
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
        feedback: 'Could not parse AI response',
        rawResult: result,
      };
    }
  }

  async evaluateFillInTheBlanks(
    dto: EvaluateFillInTheBlanksDto,
  ): Promise<any> {
    const { userAnswers, correctAnswers } = dto;
    if (userAnswers.length !== correctAnswers.length) {
      return {
        isCorrect: false,
        score: 0,
        feedback: 'Number of user answers does not match correct answers.',
      };
    }

    const correctCount = userAnswers.filter(
      (answer, index) =>
        answer.toLowerCase() === correctAnswers[index].toLowerCase(),
    ).length;

    const score = (correctCount / correctAnswers.length) * 100;
    const isCorrect = score === 100;

    return {
      isCorrect,
      score,
      feedback: `You got ${correctCount} out of ${correctAnswers.length} correct.`,
    };
  }

  async evaluateCategorization(dto: EvaluateCategorizationDto): Promise<any> {
    const { selectedCategory, correctCategory } = dto;
    const isCorrect =
      selectedCategory.toLowerCase() === correctCategory.toLowerCase();
    const score = isCorrect ? 100 : 0;

    return {
      isCorrect,
      score,
      feedback: isCorrect
        ? 'Correctly categorized!'
        : `Incorrect, the correct category was ${correctCategory}.`,
    };
  }

  async evaluateIntruder(dto: EvaluateIntruderDto): Promise<any> {
    const { selectedItem, intruderItem } = dto;
    const isCorrect = selectedItem.toLowerCase() === intruderItem.toLowerCase();
    const score = isCorrect ? 100 : 0;

    return {
      isCorrect,
      score,
      feedback: isCorrect
        ? 'Correctly identified the intruder!'
        : 'Incorrect, that was not the intruder item.',
    };
  }

  async evaluateGeneric(
    body: unknown,
    file?: UploadedAudioFile,
  ): Promise<any> {
    // This is a stub for endpoints that are not yet implemented.
    // It returns a successful evaluation so the game engine can proceed.
    console.log('Received evaluation request for unimplemented endpoint:', { body, file: file ? file.originalname : null });
    return Promise.resolve({
      isCorrect: true,
      score: 100,
      feedback: 'This exercise is not fully implemented yet, so you get a free pass!',
    });
  }
}
