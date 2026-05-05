import {Body,Controller,Get,Param,Post,Query,UseGuards} from '@nestjs/common';
import {CreateTopicDto,CreateUserDto,InitMethodDto,MethodFeedbackDto,ReinforceTopicDto,SetPreferencesDto,} from '@nexosdi.synapxix/learning/shared';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LearningService } from './learning.service';

@Controller('learning')
@UseGuards(JwtAuthGuard)
export class LearningController {
  constructor(private readonly learningService: LearningService) {}

  @Post('bootstrap')
  bootstrap() {
    return this.learningService.bootstrapSchema();
  }

  @Post('users')
  createUser(@Body() body: CreateUserDto) {
    return this.learningService.createUser(body);
  }

  @Post('topics')
  createTopic(@Body() body: CreateTopicDto) {
    return this.learningService.createTopic(body);
  }

  @Post('topics/reinforce')
  reinforceTopic(@Body() body: ReinforceTopicDto) {
    return this.learningService.reinforceTopic(body);
  }

  @Post('preferences')
  setPreferences(@Body() body: SetPreferencesDto) {
    return this.learningService.setPreferences(body);
  }

  @Post('methods/init')
  initMethod(@Body() body: InitMethodDto) {
    return this.learningService.initMethod(body);
  }

  @Post('methods/feedback')
  reinforceMethod(@Body() body: MethodFeedbackDto) {
    return this.learningService.reinforceMethod(body);
  }

  @Get(':userId/topics')
  topTopics(@Param('userId') userId: string, @Query('limit') limit?: string) {
    return this.learningService.topTopics(userId, Number(limit) || 10);
  }

  @Get(':userId/preferences')
  topPreferences(
    @Param('userId') userId: string,
    @Query('limit') limit?: string
  ) {
    return this.learningService.topPreferences(userId, Number(limit) || 10);
  }

  @Get(':userId/methods')
  topMethods(@Param('userId') userId: string, @Query('limit') limit?: string) {
    return this.learningService.topMethods(userId, Number(limit) || 10);
  }

  @Post(':userId/embedding/refresh')
  refreshEmbedding(@Param('userId') userId: string) {
    return this.learningService.refreshUserEmbedding(userId);
  }
}
