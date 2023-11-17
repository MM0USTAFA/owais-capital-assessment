import { Injectable } from '@nestjs/common';
import { CRUDService } from 'src/shared/services/crud.service';
import { Account } from './account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AccountsService extends CRUDService<Account> {
  constructor(@InjectRepository(Account) private arepo: Repository<Account>) {
    super(arepo);
  }

  create(data: Account) {
    return super.create(data);
  }
}
