import { Controller, Post, Body, UploadedFile, UseInterceptors, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExercisesService } from './exercises.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('exercises')
@UseGuards(JwtAuthGuard)
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Post('read-aloud')
  @UseInterceptors(FileInterceptor('audio'))
  async evaluateReadAloud(
    @Body('expectedText') expectedText: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @UploadedFile() file: any,
  ) {
    return this.exercisesService.evaluateAudio(expectedText, file);
  }
}
