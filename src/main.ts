import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express'
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const options = new DocumentBuilder()
    .setTitle('Auto-recourse-hub')
    .setDescription('Your API description')
    .setVersion('1.0')
    .addServer('http://localhost:3002/', 'Local environment')
    .build();
    app.enableCors();
    app.useGlobalPipes(new ValidationPipe({ forbidNonWhitelisted: true }));
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(3002);
}
bootstrap();
