import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';


@Module({
  imports: [
    // Registra Passport con estrategia JWT como predeterminada
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [
    // Registra la estrategia JWT para validar tokens de Keycloak
    JwtStrategy, 
  ],
  exports: [
    // Exporta PassportModule para que otros módulos puedan usarlo
    PassportModule,
    // Exporta JwtStrategy para que esté disponible globalmente
    JwtStrategy,
  ],
})
export class AuthModule {}
