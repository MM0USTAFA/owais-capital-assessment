import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../users/users.module';
import { CustomConfigService } from 'src/shared/services/custom-config.service';
import { HashService } from 'src/shared/services/hash.service';
import { AuthMiddleware } from './middlewares/auth.middleware';

@Module({
  controllers: [AuthController],
  providers: [AuthService, CustomConfigService, HashService],
  exports: [AuthService],
  imports: [UserModule],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        '/api/v1/auth/signin',
        '/api/v1/auth/signup',
        '/api/v1/transactions/success-deposit',
        '/ping',
      )
      .forRoutes('*');
  }
}
