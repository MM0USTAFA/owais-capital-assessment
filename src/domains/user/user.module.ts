import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { CustomConfigService } from 'src/shared/services/custom-config.service';
import { HashService } from 'src/shared/services/hash.service';

@Module({
  providers: [UsersService, CustomConfigService, HashService],
  controllers: [UsersController],
  imports: [TypeOrmModule.forFeature([User])],
  exports: [UsersService],
})
export class UserModule {}
