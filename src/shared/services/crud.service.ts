import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeepPartial,
  Entity,
  FindManyOptions,
  FindOneOptions,
  ObjectLiteral,
  Repository,
} from 'typeorm';

export class CRUDService<Entity extends ObjectLiteral> {
  constructor(@InjectRepository(Entity) private repo: Repository<Entity>) {}

  async create(data: DeepPartial<Entity>) {
    const createdData = this.repo.create(data);
    const result = await this.repo.save(createdData);
    return result;
  }

  async findOneBy(findOptions: FindOneOptions<Entity>) {
    const row = await this.repo.findOne(findOptions);
    if (!row)
      throw new NotFoundException(`${this.repo.metadata.name} not found`);
    return row;
  }

  async findMany(findManyOptions: FindManyOptions<Entity>) {
    const results = await this.repo.find(findManyOptions);
    return results;
  }

  async update(id: number, data: Partial<Entity>) {
    const record: Entity | null = await this.findOneBy({
      where: { id },
    } as FindOneOptions);

    Object.assign(record, data);
    const result = await this.repo.save(record);
    return result;
  }

  async remove(id: number) {
    const record: Entity | null = await this.findOneBy({
      where: { id },
    } as FindOneOptions);

    await this.repo.remove(record);
    return { msg: 'user has been deleted successfully', record };
  }

  async save(entity: Entity) {
    return this.repo.save(entity);
  }
}
