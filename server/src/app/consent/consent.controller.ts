import { Controller, Get, Post, Body, UseGuards, Req, Query } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { KeycloakJwtPayload } from '../auth/jwt.strategy';
import { ConsentService } from './consent.service';
import { UpdateConsentDto } from './dto/update-consent.dto';

@Controller('consent')
@UseGuards(JwtAuthGuard)
export class ConsentController {
  constructor(private readonly consentService: ConsentService) {}

  @Get('current')
  async getCurrent(@Req() req: Request, @Query('scope') scope?: string) {
    const userId = (req.user as KeycloakJwtPayload).sub as string;
    return this.consentService.getCurrentConsent(userId, scope || 'research');
  }

  @Post()
  async update(
    @Req() req: Request,
    @Body() dto: UpdateConsentDto,
  ) {
    const userId = (req.user as KeycloakJwtPayload).sub as string;
    return this.consentService.updateConsent(userId, dto);
  }
}
