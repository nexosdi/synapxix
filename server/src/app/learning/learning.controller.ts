import { Body, Controller, Get, Post, Query, UseGuards, UsePipes, ValidationPipe, Request, Param } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
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
  createUser(@Request() req: ExpressRequest & { user: { id: string } }, @Body() body: CreateUserDto) {
    body.userId = req.user.id;
    return this.learningService.createUser(body);
  }

  @Post('topics')
  createTopic(@Request() req: ExpressRequest & { user: { id: string } }, @Body() body: CreateTopicDto) {
    body.userId = req.user.id;
    return this.learningService.createTopic(body);
  }

  @Post('topics/feedback')
  feedbackTopic(@Request() req: ExpressRequest & { user: { id: string } }, @Body() body: ReinforceTopicDto) {
    body.userId = req.user.id;
    return this.learningService.reinforceTopic(body);
  }

  @Post('preferences')
  setPreferences(@Request() req: ExpressRequest & { user: { id: string } }, @Body() body: SetPreferencesDto) {
    body.userId = req.user.id;
    return this.learningService.setPreferences(body);
  }

  @Post('methods/init')
  initMethod(@Request() req: ExpressRequest & { user: { id: string } }, @Body() body: InitMethodDto) {
    body.userId = req.user.id;
    return this.learningService.initMethod(body);
  }

  @Post('methods/feedback')
  feedbackMethod(@Request() req: ExpressRequest & { user: { id: string } }, @Body() body: MethodFeedbackDto) {
    body.userId = req.user.id;
    return this.learningService.reinforceMethod(body);
  }

  @Get('topics')
  topTopics(@Request() req: ExpressRequest & { user: { id: string } }, @Query('limit') limit?: string) {
    return this.learningService.topTopics(req.user.id, Number(limit) || 10);
  }

  @Get('preferences')
  topPreferences(@Request() req: ExpressRequest & { user: { id: string } }, @Query('limit') limit?: string) {
    return this.learningService.topPreferences(req.user.id, Number(limit) || 10);
  }

  @Get('methods')
  topMethods(@Request() req: ExpressRequest & { user: { id: string } }, @Query('limit') limit?: string) {
    return this.learningService.topMethods(req.user.id, Number(limit) || 10);
  }

  @Post('embedding/refresh')
  refreshEmbedding(@Request() req: ExpressRequest & { user: { id: string } }) {
    return this.learningService.refreshUserEmbedding(req.user.id);
  }

  @Get(':userId/graph')
  getUserGraph(@Param('userId') userId: string) {
    return this.learningService.getUserGraph(userId);
  }

  @Get(':userId/recommended-path')
  getRecommendedPath(@Param('userId') userId: string) {
    return this.learningService.getRecommendedPath(userId);
  }
}
