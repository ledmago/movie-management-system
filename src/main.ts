import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe, BadRequestException } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/http-exeption.fitlter';

const PORT = process.env.PORT ?? 80

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({
    exceptionFactory: (errors) => {
      const messages = errors.map((error) => ({
        field: error.property,
        message: Object.values(error.constraints ?? {}).join(', '),
      }));
      return new BadRequestException({
        statusCode: 400,
        status: false,
        message: messages.map((message) => message.message).join(', '),
        errors: messages
      });
    }
  }));
  Logger.log(`Server started on port ${PORT}` )

  const config = new DocumentBuilder()
    .setTitle('Api Documentation of movie management system')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'Bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'JWT token giriniz',
        in: 'header',
      },
      'authorization',
    )
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('documentation', app, documentFactory);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
