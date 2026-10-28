import { Controller, Get, Post, Patch, Param, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async findAll(@Request() req: { user: { sub: string } }) {
    return this.notificationsService.findAllForUser(req.user.sub);
  }

  @Post()
  async create(@Body() dto: CreateNotificationDto, @Request() req: { user: { sub: string } }) {
    return this.notificationsService.create(dto, req.user.sub, false);
  }

  @Patch('read-all')
  async markAllAsRead(@Request() req: { user: { sub: string } }) {
    return this.notificationsService.markAllAsRead(req.user.sub);
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string, @Request() req: { user: { sub: string } }) {
    return this.notificationsService.markAsRead(id, req.user.sub);
  }
}
