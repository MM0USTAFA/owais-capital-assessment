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

  async findOneBy(record: Record<string, any>) {
    const row = await this.repo.findOneBy(record);
    return row;
  }

  async findMany(findManyOptions: FindManyOptions<Entity>) {
    const results = await this.repo.find(findManyOptions);
    return results;
  }

  async update(id: number, data: Entity) {
    const record: Entity | null = await this.findOneBy({ id });

    if (!record)
      throw new NotFoundException(`"${Entity.name}" record not found`);

    Object.assign(record, data);
    const result = await this.repo.save(record);
    return result;
  }

  async remove(id: number) {
    const record: Entity | null = await this.findOneBy({ id });

    if (!record)
      throw new NotFoundException(`"${Entity.name}" record not found`);

    await this.repo.remove(record);
    return { msg: 'user has been deleted successfully' };
  }
}
