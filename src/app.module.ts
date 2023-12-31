import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfigs } from './config/db/db.conf';
import { ConfigModule } from '@nestjs/config';
import configs, { configsValidationSchema } from './config/env.conf';
import { CustomConfigService } from './shared/services/custom-config.service';
import { UserModule } from './domains/users/users.module';
import { AuthModule } from './domains/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { TransactionsModule } from './domains/transactions/transactions.module';
import { AccountsModule } from './domains/accounts/accounts.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configs],
      validationSchema: configsValidationSchema,
    }),
    JwtModule.registerAsync({
      global: true,
      extraProviders: [CustomConfigService],
      inject: [CustomConfigService],
      useFactory: (config: CustomConfigService) => {
        return {
          secret: config.get('JWT_SECRET_KEY'),
          signOptions: {
            algorithm: 'HS256',
            expiresIn: '1y',
          },
        };
      },
    }),
    TypeOrmModule.forRootAsync(typeOrmConfigs),
    UserModule,
    AuthModule,
    TransactionsModule,
    AccountsModule,
  ],
  controllers: [AppController],
  providers: [CustomConfigService],
})
export class AppModule {}
