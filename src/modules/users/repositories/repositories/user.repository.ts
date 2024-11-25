import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityRelational } from '../../../../common/database/relation/entities/relational-entity-helper';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>
  ) {}

  async create(data: EntityRelational): Promise<UserEntity> {
    return await this.usersRepository.save(this.usersRepository.create(data));
  }

  async exists(find: Record<string, any>): Promise<boolean> {
    return this.usersRepository.exists(find);
  }

  async findOneById(id: number): Promise<UserEntity | null> {
    return this.usersRepository.findOneBy({ id: id });
  }
}
