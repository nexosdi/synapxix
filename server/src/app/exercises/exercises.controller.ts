import { Controller, Post, Body, UploadedFile, UseInterceptors, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExercisesService } from './exercises.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

/**
 * Controlador de Ejercicios.
 * Administra la evaluación de ejercicios interactivos como el "Read Aloud".
 * Los endpoints privados implementan `@UseGuards(JwtAuthGuard)` para exigir token Bearer desde el VPS de Keycloak.
 */
@Controller('exercises')
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Post('read-aloud')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('audio'))
  async evaluateReadAloud(
    @Body('expectedText') expectedText: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @UploadedFile() file: any,
  ) {
    return this.exercisesService.evaluateAudio(expectedText, file);
  }
}
