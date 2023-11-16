import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Entity, FindManyOptions, ObjectLiteral, Repository } from 'typeorm';

export class CRUDService<Entity extends ObjectLiteral> {
  constructor(@InjectRepository(Entity) private repo: Repository<Entity>) {}

  async create(data: Entity) {
    const createdData = this.repo.create(data);
    const result = await this.repo.save(createdData);
    return result;
  }

  async findOneById(id: number) {
    const records: Entity[] = await this.repo
      .createQueryBuilder()
      .select('*')
      .where('id = :id', { id })
      .execute();
    return records[0];
  }

  async findMany(findManyOptions: FindManyOptions<Entity>) {
    const results = await this.repo.find(findManyOptions);
    return results;
  }

  async update(id: number, data: Entity) {
    const record: Entity | null = await this.findOneById(id);

    if (!record)
      throw new NotFoundException(`"${Entity.name}" record not found`);

    Object.assign(record, data);
    const result = await this.repo.save(record);
    return result;
  }

  async delete(id: number) {
    const record: Entity | null = await this.findOneById(id);

    if (!record)
      throw new NotFoundException(`"${Entity.name}" record not found`);

    const result = await this.repo.delete(record);
    return result;
  }
}
