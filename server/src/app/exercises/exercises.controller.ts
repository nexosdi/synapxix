import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExercisesService } from './exercises.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EvaluateReadAloudDto } from './dto/evaluate-read-aloud.dto';
import { readAloudAudioFilePipe } from './validators/read-aloud-audio.validation';
import { UploadedAudioFile } from './types/uploaded-audio-file';


@Controller('exercises')
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Post('read-aloud')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('audio'))
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  )
  evaluateReadAloud(
    @Body() body: EvaluateReadAloudDto,
    @UploadedFile(readAloudAudioFilePipe) file: UploadedAudioFile,
  ) {
    return this.exercisesService.evaluateAudio(body, file);
  }
}
