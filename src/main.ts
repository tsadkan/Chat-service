import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { ValidationException } from './filters/validation.exception';
import { MongoExceptionFilter } from './filters/mongo.filter';
import { HttpExceptionFilter } from './filters/http.filter';
import { ValidationExceptionFilter } from './filters/validation.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(
    new HttpExceptionFilter(),
    new ValidationExceptionFilter(),
    new MongoExceptionFilter()
  );

  app.useGlobalPipes(new ValidationPipe({
      skipMissingProperties: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const messages = errors.map(
          error => `${error.property} has wrong value ${error.value},
          ${Object.values(error.constraints).join(', ')}`
        );

        return new ValidationException(messages);
      }
  }));
  await app.listen(3000);
}
bootstrap();
