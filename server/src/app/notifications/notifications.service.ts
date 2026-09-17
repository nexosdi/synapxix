import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@nexosdi.synapxix/prisma';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateNotificationDto, senderId?: string, isSystem = false) {
    // If not system, check if sender has access to receiver
    if (!isSystem && senderId && senderId !== dto.userId) {
      const link = await this.prisma.userLink.findFirst({
        where: {
          id_user_from: senderId,
          id_user_to: dto.userId,
        },
      });
      if (!link) {
        throw new ForbiddenException('No permissions to send notifications to this user');
      }
    }

    return this.prisma.notification.create({
      data: {
        user_id: dto.userId,
        title: dto.title,
        message: dto.message,
      },
    });
  }

  async findAllForUser(userId: string) {
    return this.prisma.notification.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
    });
  }

  async markAsRead(notificationId: string, userId: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { notification_id: notificationId },
    });

    if (!notification) throw new NotFoundException('Notification not found');
    if (notification.user_id !== userId) throw new ForbiddenException('Cannot modify this notification');

    return this.prisma.notification.update({
      where: { notification_id: notificationId },
      data: { read: true },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { user_id: userId, read: false },
      data: { read: true },
    });
  }
}
