import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfigs } from './config/db/db.conf';
import { ConfigModule } from '@nestjs/config';
import configs, { configsValidationSchema } from './config/env.conf';
import { CustomConfigService } from './shared/services/custom-config.service';
import { UserModule } from './domains/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configs],
      validationSchema: configsValidationSchema,
    }),
    TypeOrmModule.forRootAsync(typeOrmConfigs),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, CustomConfigService],
})
export class AppModule {}
