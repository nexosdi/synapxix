import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';
import { KeycloakJwtPayload } from './jwt.strategy';

@Controller('auth')
export class AuthController {
  @UseGuards(JwtAuthGuard)
  @Get('preferences')
  async getPreferences(@Req() req: Request & { user: KeycloakJwtPayload }) {
    const keycloakUser = req.user;

    return {
      usuario: {
        id: keycloakUser.sub,
        email: keycloakUser.email, 
        nombre: keycloakUser.name
      },
      preferencias: {
        theme: 'dark',
        notifications: true,
        language: 'es'
      }
    };
  }
}