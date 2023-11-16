import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../users/users.module';
import { CustomConfigService } from 'src/shared/services/custom-config.service';
import { HashService } from 'src/shared/services/hash.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, CustomConfigService, HashService],
  exports: [AuthService],
  imports: [UserModule],
})
export class AuthModule {}
