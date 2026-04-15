/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  // --- SOLUCIÓN AL CORS AQUÍ ---
  app.enableCors({
    origin: 'http://localhost:4300', // El puerto exacto de tu Angular
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Importante si usas cookies o tokens en headers
  });
  // ------------------------------

  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();