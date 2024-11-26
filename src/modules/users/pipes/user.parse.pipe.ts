import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UserEntity } from '../repository/entities/user.entity';
import { ENUM_USER_STATUS_CODE_ERROR } from '../enums/user.status-code.enum';

@Injectable()
export class UserParsePipe implements PipeTransform {
  constructor(private readonly userService: UserService) {}

  async transform(value: number): Promise<UserEntity> {
    const user: UserEntity | null = await this.userService.findOneById(value);
    if (!user) {
      throw new NotFoundException({
        statusCode: ENUM_USER_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'user.error.notFound',
      });
    }

    return user;
  }
}
