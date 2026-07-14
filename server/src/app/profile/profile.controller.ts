import { Controller, Get, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express'; // <--- Esto es necesario para el tipado en Nest
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; 
import { KeycloakJwtPayload } from '../auth/jwt.strategy';
import { ProfileService } from './profile.service';
import { UpdatePreferencesDto } from './dto/updated-preferences';

/**
 * Controlador de Perfil de Usuario.
 * Maneja operaciones relacionadas con las preferencias del usuario.
 * Utiliza el `JwtAuthGuard` para garantizar que la petición provenga de una sesión válida en Keycloak,
 * extrayendo el ID del usuario (`sub`) directamente del token.
 */
@Controller('preferences')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

@Get()
async get(@Req() req: Request) {
  const userId = (req.user as KeycloakJwtPayload).sub!; 
  return this.profileService.getPreferences(userId);
}

  @Patch()
  async update(
    @Req() req: Request, 
    @Body() updatePreferencesDto: UpdatePreferencesDto 
  ) {
    const userId = (req.user as KeycloakJwtPayload).sub!;
    return this.profileService.updatePreferences(userId, updatePreferencesDto);
  }
}