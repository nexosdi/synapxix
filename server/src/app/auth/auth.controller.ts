import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express'; // <-- Importamos el TIPO de Express
import { JwtAuthGuard } from './jwt-auth.guard';
import { Auth0JwtPayload } from './jwt.strategy'; // <-- Importamos tu tipado del payload

@Controller('auth')
export class AuthController {
  
  @UseGuards(JwtAuthGuard)
  @Get('preferences')
  async getPreferences(
    // Aquí le decimos a TS: "Esto es una Request de Express que además trae a nuestro user"
    @Req() req: Request & { user: Auth0JwtPayload } 
  ) {
    const auth0User = req.user;

    // Ahora TypeScript sabe exactamente qué propiedades tiene auth0User
    // y te autocompletará auth0User.sub, auth0User.email, etc.
    
    return {
      usuario: {
        id: auth0User.sub,
        email: auth0User.email, 
        nombre: auth0User.name
      },
      preferencias: {
        theme: 'dark',
        notifications: true,
        language: 'es'
      }
    };
  }
}