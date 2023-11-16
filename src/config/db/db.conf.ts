import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { CustomConfigService } from 'src/shared/services/custom-config.service';

export const typeOrmConfigs: TypeOrmModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: (config: CustomConfigService) => {
    return {
      type: 'postgres',
      port: config.get('DB_PORT'),
      host: config.get('DB_HOST'),
      database: config.get('DB_NAME'),
      username: config.get('DB_USERNAME'),
      password: config.get('DB_PASSWORD'),
      synchronize: true,
      entities: ['**/*.entity.js'],
    };
  },
};
