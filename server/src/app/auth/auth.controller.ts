import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express'; // <-- Importamos el TIPO de Express
import { JwtAuthGuard } from './jwt-auth.guard';
import { KeycloakJwtPayload } from './jwt.strategy'; // <-- Importamos tu tipado del payload

/**
 * Controlador de Autenticación.
 * Maneja las preferencias de usuario usando los datos extraídos del token JWT de Keycloak (`req.user`).
 */
@Controller('auth')
export class AuthController {
  
  @UseGuards(JwtAuthGuard)
  @Get('preferences')
  async getPreferences(
    // Aquí le decimos a TS: "Esto es una Request de Express que además trae a nuestro user"
    @Req() req: Request & { user: KeycloakJwtPayload } 
  ) {
    const keycloakUser = req.user;

    // Ahora TypeScript sabe exactamente qué propiedades tiene keycloakUser
    // y te autocompletará keycloakUser.sub, keycloakUser.email, etc.
    
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