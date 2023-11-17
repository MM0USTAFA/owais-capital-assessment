import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'verbose', 'warn', 'log'],
  });
  app.enableCors();
  app.use(helmet());
  const config = new DocumentBuilder()
    .setTitle('Owais Capital Assessment')
    .setDescription(
      `It's a simple apis to use the minimal operations in fintech`,
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  app.useGlobalPipes(new ValidationPipe({}));
  await app.listen(3000);
}
bootstrap();
