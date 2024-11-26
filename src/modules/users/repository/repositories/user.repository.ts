import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityRelational } from '../../../../common/database/relation/entities/relational-entity-helper';
import { ENUM_USER_STATUS } from '../../enums/user.enum';

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
    return this.usersRepository.exists({
      where: find,
    });
  }

  async findOneById(id: number): Promise<UserEntity | null> {
    return this.usersRepository.findOneBy({ id: id });
  }

  async findOneByIdWithActive(id: number): Promise<UserEntity | null> {
    return this.usersRepository.findOneBy({
      id: id,
      status: ENUM_USER_STATUS.ACTIVE,
    });
  }

  async findOneByEmail(email: string): Promise<UserEntity | null> {
    return this.usersRepository.findOneBy({ email: email });
  }

  async save(user: UserEntity): Promise<UserEntity> {
    return this.usersRepository.save(user);
  }
}
