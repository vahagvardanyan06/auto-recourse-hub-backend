import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SecuritySchemeObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
export async function bootstrap() {
const app = await NestFactory.create(AppModule);
  const options = new DocumentBuilder()
    .addBearerAuth(
      {
        description: 'JWT Authorization',
        type: 'http',
        in: 'header',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      } as SecuritySchemeObject,
      'auto-recourse-hub'
    )
    .setTitle('Auto-recourse-hub')
    .setDescription('Your API description')
    .setVersion('1.0')
    .addServer('/api')
    .build();
    app.enableCors({
      origin : 'http://example.flan',
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    });
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ forbidNonWhitelisted: true }));
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api-docs', app, document);
    Logger.log(`Listening to port ${process.env.PORT}`)
    await app.listen(process.env.PORT);
}
bootstrap();
