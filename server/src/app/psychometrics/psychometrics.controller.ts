import { Body, Controller, createParamDecorator, ExecutionContext, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateCognitiveEvaluationDto } from './dto/create-cognitive-evaluation.dto';
import { CreateMotorEvaluationDto } from './dto/create-motor-evaluation.dto';
import { PsychometricsService } from './psychometrics.service';

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (data) return request.user?.[data];
    return request.user;
  }
);

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class PsychometricsController {
  constructor(private readonly psychometricsService: PsychometricsService) {}

  @Post('cognitive')
  async submitCognitiveEvaluation(
    @GetUser('user_id') userId: string,
    @Body() body: CreateCognitiveEvaluationDto
  ) {
    return this.psychometricsService.processCognitiveEvaluation(userId, body);
  }

  @Post('motor')
  async submitMotorEvaluation(
    @GetUser('user_id') userId: string,
    @Body() body: CreateMotorEvaluationDto
  ) {
    return this.psychometricsService.processMotorEvaluation(userId, body);
  }
}
