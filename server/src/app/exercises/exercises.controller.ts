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
import { EvaluateFillInTheBlanksDto } from './dto/evaluate-fill-in-the-blanks.dto';
import { EvaluateCategorizationDto } from './dto/evaluate-categorization.dto';
import { EvaluateIntruderDto } from './dto/evaluate-intruder.dto';


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

  // --- STUBBED ENDPOINTS --- //

  @Post('avatar-game')
  @UseGuards(JwtAuthGuard)
  evaluateAvatarGame(@Body() body: unknown) {
    return this.exercisesService.evaluateGeneric(body);
  }

  @Post('balance-game')
  @UseGuards(JwtAuthGuard)
  evaluateBalanceGame(@Body() body: unknown) {
    return this.exercisesService.evaluateGeneric(body);
  }

  @Post('categorization-game')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  evaluateCategorizationGame(@Body() body: EvaluateCategorizationDto) {
    return this.exercisesService.evaluateCategorization(body);
  }

  @Post('fill-in-the-blanks-game')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  evaluateFillInTheBlanksGame(@Body() body: EvaluateFillInTheBlanksDto) {
    return this.exercisesService.evaluateFillInTheBlanks(body);
  }

  @Post('intruder-game')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  evaluateIntruderGame(@Body() body: EvaluateIntruderDto) {
    return this.exercisesService.evaluateIntruder(body);
  }

  @Post('listen-type-game')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('audio'))
  evaluateListenTypeGame(
    @Body() body: unknown,
    @UploadedFile() file?: UploadedAudioFile,
  ) {
    return this.exercisesService.evaluateGeneric(body, file);
  }

  @Post('neural-link-game')
  @UseGuards(JwtAuthGuard)
  evaluateNeuralLinkGame(@Body() body: unknown) {
    return this.exercisesService.evaluateGeneric(body);
  }

  @Post('read-select-game')
  @UseGuards(JwtAuthGuard)
  evaluateReadSelectGame(@Body() body: unknown) {
    return this.exercisesService.evaluateGeneric(body);
  }

  @Post('sound-match')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('audio'))
  evaluateSoundMatch(
    @Body() body: unknown,
    @UploadedFile() file?: UploadedAudioFile,
  ) {
    return this.exercisesService.evaluateGeneric(body, file);
  }

  @Post('speak-about-photo-game')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('media'))
  evaluateSpeakAboutPhotoGame(
    @Body() body: unknown,
    @UploadedFile() file?: UploadedAudioFile,
  ) {
    return this.exercisesService.evaluateGeneric(body, file);
  }

  @Post('spotlight-game')
  @UseGuards(JwtAuthGuard)
  evaluateSpotlightGame(@Body() body: unknown) {
    return this.exercisesService.evaluateGeneric(body);
  }

  @Post('timeline-order-game')
  @UseGuards(JwtAuthGuard)
  evaluateTimelineOrderGame(@Body() body: unknown) {
    return this.exercisesService.evaluateGeneric(body);
  }
}
