import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/exception/httpException.filter';
import { QueryFailedFilter } from './common/exception/queryFailedFilter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT;

  // 예외 처리 글로벌 설정
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalFilters(new QueryFailedFilter());

  // class-validation 활용을 위한 등록
  app.useGlobalPipes(new ValidationPipe());

  // swagger 등록
  const config = new DocumentBuilder()
    .setTitle('RentEase')
    .setDescription('user')
    .setVersion('1.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // CORS
  app.enableCors({
    origin: true, // 배포할 때는 특정 url로 수정
    credentials: true,
  });

  await app.listen(PORT);
}
bootstrap();
