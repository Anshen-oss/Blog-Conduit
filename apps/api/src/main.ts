import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Préfixe global — toutes les routes seront sous /api
  app.setGlobalPrefix('api');

  // Active la validation automatique des DTOs via class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // supprime les champs non déclarés dans le DTO
      forbidNonWhitelisted: true, // erreur si un champ inconnu est envoyé
      transform: true, // transforme le JSON en instance de classe DTO
    }),
  );

  // Permet à NestJS de lire les cookies (req.cookies)
  app.use(cookieParser());

  // CORS pour le frontend Next.js
  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    credentials: true, // indispensable pour les cookies cross-origin
  });

  await app.listen(3001);
}

bootstrap();
