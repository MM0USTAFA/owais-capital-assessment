import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfigs } from './config/swagger.conf';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'verbose', 'warn', 'log'],
  });
  app.setGlobalPrefix('/api', { exclude: ['/ping'] });
  app.enableCors();
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe({}));

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1'],
  });

  const document = SwaggerModule.createDocument(app, swaggerConfigs);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);
}
bootstrap();
