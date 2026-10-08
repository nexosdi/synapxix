

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app/app.module';

import { Logger as PinoLogger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(PinoLogger));
  
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

  app.enableCors({
    origin: ['http://localhost:4200', 'http://localhost:4300'], 
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