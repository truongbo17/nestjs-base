import { Injectable } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SessionEntity } from '../entities/session.entity';
import { UserEntity } from '../../../users/repository/entities/user.entity';
import { SessionCreateRequestDto } from '../../dtos/request/session.create.request.dto';

@Injectable()
export class SessionRepository {
  constructor(
    @InjectRepository(SessionEntity)
    private readonly sessionRepository: Repository<SessionEntity>
  ) {}

  async create(data: SessionCreateRequestDto): Promise<SessionEntity> {
    return await this.sessionRepository.save(
      this.sessionRepository.create(data)
    );
  }

  async findOneById(id: number): Promise<SessionEntity | null> {
    return this.sessionRepository.findOneBy({ id: id });
  }

  async findOneByIdAndUser(
    id: number,
    user: UserEntity
  ): Promise<SessionEntity | null> {
    return this.sessionRepository.findOneBy({ id: id, user: user });
  }

  async deleteByUserId(id: number): Promise<DeleteResult> {
    return this.sessionRepository.softDelete({
      user: {
        id: id,
      },
    });
  }
}
