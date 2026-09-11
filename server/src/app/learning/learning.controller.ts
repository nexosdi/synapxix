import { Body, Controller, Get, Post, Query, UseGuards, UsePipes, ValidationPipe, Request } from '@nestjs/common';
import { CreateTopicDto, CreateUserDto, InitMethodDto, MethodFeedbackDto, ReinforceTopicDto, SetPreferencesDto } from '@nexosdi.synapxix/learning/shared';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LearningService } from './learning.service';

@Controller('learning')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class LearningController {
  constructor(private readonly learningService: LearningService) {}

  @Post('bootstrap')
  bootstrap() {
    return this.learningService.bootstrapSchema();
  }

  @Post('users')
  createUser(@Request() req: any, @Body() body: CreateUserDto) {
    body.userId = req.user.id;
    return this.learningService.createUser(body);
  }

  @Post('topics')
  createTopic(@Request() req: any, @Body() body: CreateTopicDto) {
    body.userId = req.user.id;
    return this.learningService.createTopic(body);
  }

  @Post('topics/feedback')
  feedbackTopic(@Request() req: any, @Body() body: ReinforceTopicDto) {
    body.userId = req.user.id;
    return this.learningService.reinforceTopic(body);
  }

  @Post('preferences')
  setPreferences(@Request() req: any, @Body() body: SetPreferencesDto) {
    body.userId = req.user.id;
    return this.learningService.setPreferences(body);
  }

  @Post('methods/init')
  initMethod(@Request() req: any, @Body() body: InitMethodDto) {
    body.userId = req.user.id;
    return this.learningService.initMethod(body);
  }

  @Post('methods/feedback')
  feedbackMethod(@Request() req: any, @Body() body: MethodFeedbackDto) {
    body.userId = req.user.id;
    return this.learningService.reinforceMethod(body);
  }

  @Get('topics')
  topTopics(@Request() req: any, @Query('limit') limit?: string) {
    return this.learningService.topTopics(req.user.id, Number(limit) || 10);
  }

  @Get('preferences')
  topPreferences(@Request() req: any, @Query('limit') limit?: string) {
    return this.learningService.topPreferences(req.user.id, Number(limit) || 10);
  }

  @Get('methods')
  topMethods(@Request() req: any, @Query('limit') limit?: string) {
    return this.learningService.topMethods(req.user.id, Number(limit) || 10);
  }

  @Post('embedding/refresh')
  refreshEmbedding(@Request() req: any) {
    return this.learningService.refreshUserEmbedding(req.user.id);
  }
}
