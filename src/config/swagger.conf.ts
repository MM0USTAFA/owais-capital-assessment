import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfigs = new DocumentBuilder()
  .setTitle('Owais Capital Assessment')
  .setDescription(`It's a simple apis to use the minimal operations in fintech`)
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'header',
    },
    'Authorization',
  )
  .setVersion('1.0')
  .build();
