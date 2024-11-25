import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  PipeTransform,
  Scope,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { IRequestApp } from 'src/common/request/interfaces/request.interface';
import { ENUM_USER_STATUS_CODE_ERROR } from '../enums/user.status-code.enum';

@Injectable({ scope: Scope.REQUEST })
export class UserNotSelfPipe implements PipeTransform {
  constructor(@Inject(REQUEST) protected readonly request: IRequestApp) {}

  async transform(value: number): Promise<number> {
    const { user } = this.request;
    if (!user) {
      throw new NotFoundException({
        statusCode: ENUM_USER_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'user.error.notFound',
      });
    }

    if (user.id !== value) {
      throw new BadRequestException({
        statusCode: ENUM_USER_STATUS_CODE_ERROR.NOT_SELF,
        message: 'user.error.notSelf',
      });
    }

    return value;
  }
}
