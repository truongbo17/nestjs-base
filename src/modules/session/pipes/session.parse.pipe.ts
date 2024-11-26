import {
  Inject,
  Injectable,
  NotFoundException,
  PipeTransform,
  Scope,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { IRequestApp } from 'src/common/request/interfaces/request.interface';
import { SessionService } from '../services/session.service';
import { ENUM_SESSION_STATUS_CODE_ERROR } from '../enums/session.status-code.enum';
import { SessionEntity } from '../repository/entities/session.entity';
import { ENUM_USER_STATUS_CODE_ERROR } from '../../users/enums/user.status-code.enum';
import { UserRepository } from '../../users/repository/repositories/user.repository';
import { UserEntity } from '../../users/repository/entities/user.entity';

@Injectable()
export class SessionActiveParsePipe implements PipeTransform {
  constructor(
    @Inject(REQUEST) protected readonly request: IRequestApp,
    private readonly sessionService: SessionService
  ) {}

  async transform(value: number): Promise<SessionEntity> {
    const session = await this.sessionService.findById(value);
    if (!session) {
      throw new NotFoundException({
        statusCode: ENUM_SESSION_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'session.error.notFound',
      });
    }

    return session;
  }
}

@Injectable({ scope: Scope.REQUEST })
export class SessionActiveByUserParsePipe implements PipeTransform {
  constructor(
    @Inject(REQUEST) protected readonly request: IRequestApp,
    private readonly sessionService: SessionService,
    private readonly userRepository: UserRepository
  ) {}

  async transform(value: number): Promise<SessionEntity> {
    const { user } = this.request;

    if (!user) {
      throw new NotFoundException({
        statusCode: ENUM_USER_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'user.error.notFound',
      });
    }
    const currentUser: UserEntity | null =
      await this.userRepository.findOneById(user.id);
    if (!currentUser) {
      throw new NotFoundException({
        statusCode: ENUM_USER_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'user.error.notFound',
      });
    }

    const session = await this.sessionService.findOneByIdAndUser(
      value,
      currentUser
    );
    if (!session) {
      throw new NotFoundException({
        statusCode: ENUM_SESSION_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'session.error.notFound',
      });
    }

    return session;
  }
}
