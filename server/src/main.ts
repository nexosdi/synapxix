

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { json, urlencoded } from 'express';
import helmet from 'helmet';
import { AppModule } from './app/app.module';
import { AllExceptionsFilter } from './app/core/filters/all-exceptions.filter';
import { HttpAdapterHost } from '@nestjs/core';

import { Logger as PinoLogger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false, bufferLogs: true });
  app.useLogger(app.get(PinoLogger));

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

  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  // CORS_ORIGIN reemplaza los orígenes locales; CORS_ORIGINS suma orígenes
  // extra (producción), p. ej. el Primer Pulso servido desde la landing.
  const list = (v?: string) => (v ?? '').split(',').map((o) => o.trim()).filter(Boolean);
  const baseOrigins = process.env.CORS_ORIGIN
    ? list(process.env.CORS_ORIGIN)
    : ['http://localhost:4200', 'http://localhost:4201', 'http://localhost:4300', 'http://localhost:4400'];
  const corsOrigins = [...baseOrigins, ...list(process.env.CORS_ORIGINS)];

  app.enableCors({
    origin: corsOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
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