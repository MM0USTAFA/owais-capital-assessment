import { Injectable } from '@nestjs/common';
import { CRUDService } from 'src/shared/services/crud.service';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HashService } from 'src/shared/services/hash.service';

@Injectable()
export class UsersService extends CRUDService<User> {
  constructor(
    @InjectRepository(User) private urepo: Repository<User>,
    private hashService: HashService,
  ) {
    super(urepo);
  }

  async create(data: User): Promise<User> {
    data.password = await this.hashService.hash(data.password);
    return super.create(data);
  }
}
