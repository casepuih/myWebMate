import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { validationExceptionFactory } from './exceptions/validation.exception';
import { HttpExceptionFilter } from './filters/http-exception/http-exception.filter';
import { ValidationExceptionFilter } from './filters/validation-exception/validation-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalFilters(
    new HttpExceptionFilter(),
    new ValidationExceptionFilter()
  )
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))
  app.useGlobalPipes(new ValidationPipe({
    errorHttpStatusCode: 422,
    exceptionFactory: validationExceptionFactory
  }))
  await app.listen(3000);
}
bootstrap();
