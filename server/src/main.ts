/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { json, urlencoded } from 'express';
import helmet from 'helmet';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });

  // El CV viaja en base64 (hasta 5 MB): solo esa ruta acepta cuerpos grandes.
  app.use('/api/team/v1/me/cv', json({ limit: '8mb' }));
  app.use(json({ limit: '100kb' }));
  app.use(urlencoded({ extended: true, limit: '100kb' }));
  
  // Security headers (OWASP recommended)
  app.use(helmet());
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  // Orígenes extra (producción) separados por coma, p. ej. la app team en Vercel.
  const extraOrigins = (process.env.CORS_ORIGINS ?? '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  app.enableCors({
    origin: ['http://localhost:4200', 'http://localhost:4300', 'http://localhost:4400', ...extraOrigins],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // Agregamos OPTIONS
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'], // <--- ESTO ES CLAVE
    credentials: true,
  });
  // ---------------------------------------

  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();