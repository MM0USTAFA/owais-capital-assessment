import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { HandleAccountBodyMiddleware } from './middlewares/handle-account-body.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './account.entity';
import { CustomConfigService } from 'src/shared/services/custom-config.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { HashService } from 'src/shared/services/hash.service';

@Module({
  imports: [TypeOrmModule.forFeature([Account, User])],
  controllers: [AccountsController],
  providers: [AccountsService, CustomConfigService, UsersService, HashService],
})
export class AccountsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(HandleAccountBodyMiddleware)
      .forRoutes({ path: '/accounts', method: RequestMethod.POST });
  }
}
