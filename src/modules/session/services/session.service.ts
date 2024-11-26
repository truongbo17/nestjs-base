import { Injectable } from '@nestjs/common';
import { SessionServiceInterface } from '../interfaces/session.service.interface';
import { SessionRepository } from '../repository/repositories/session.repository';
import { SessionEntity } from '../repository/entities/session.entity';
import { UserEntity } from '../../users/repository/entities/user.entity';
import { SessionCreateRequestDto } from '../dtos/request/session.create.request.dto';

@Injectable()
export class SessionService implements SessionServiceInterface {
  constructor(private readonly sessionRepository: SessionRepository) {}

  async findById(id: number): Promise<SessionEntity | null> {
    return this.sessionRepository.findOneById(id);
  }

  async findOneByIdAndUser(
    id: number,
    user: UserEntity
  ): Promise<SessionEntity | null> {
    return this.sessionRepository.findOneByIdAndUser(id, user);
  }

  async create(data: SessionCreateRequestDto): Promise<SessionEntity> {
    return this.sessionRepository.create(data);
  }

  async deleteByUser(userId: number) {
    return this.sessionRepository.deleteByUserId(userId);
  }
}
