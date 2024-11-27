import { UserServiceInterface } from '../interfaces/user.service.interface';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IAuthPassword } from '../../../core/auth/interfaces/auth.interface';
import { UserEntity } from '../repository/entities/user.entity';
import { ENUM_USER_STATUS } from '../enums/user.enum';
import { UserRepository } from '../repository/repositories/user.repository';
import { UserCreateRequestDto } from '../dtos/requests/user.create.request.dto';
import { UserUpdateRequestDto } from '../dtos/requests/user.update.request.dto';
import { ENUM_USER_STATUS_CODE_ERROR } from '../enums/user.status-code.enum';
import { FileEntity } from '../../file/repository/entities/file.entity';

@Injectable()
export class UserService implements UserServiceInterface {
  constructor(private readonly userRepository: UserRepository) {}

  async existByEmail(email: string): Promise<boolean> {
    return this.userRepository.exists({ email: email });
  }

  async findOneById(id: number): Promise<UserEntity | null> {
    return this.userRepository.findOneById(id);
  }

  async findOneByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findOneByEmail(email);
  }

  async create(
    { email, name, gender }: UserCreateRequestDto,
    { passwordHash }: IAuthPassword
  ): Promise<UserEntity> {
    const user: UserEntity = new UserEntity();
    user.email = email;
    user.name = name;
    user.gender = gender;
    user.status = ENUM_USER_STATUS.ACTIVE;
    user.password = passwordHash;

    return this.userRepository.create(user);
  }

  async updatePassword(
    user: UserEntity,
    { passwordHash }: IAuthPassword
  ): Promise<UserEntity> {
    user.password = passwordHash;

    return this.userRepository.save(user);
  }

  async update(
    user: UserEntity,
    { gender, name }: UserUpdateRequestDto
  ): Promise<UserEntity> {
    user.gender = gender;
    user.name = name;

    return this.userRepository.save(user);
  }

  async activeUser(id: number): Promise<UserEntity> {
    const user: UserEntity | null = await this.findOneById(id);

    if (!user) {
      throw new NotFoundException({
        statusCode: ENUM_USER_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'user.error.notFound',
      });
    } else if (user.status !== ENUM_USER_STATUS.ACTIVE) {
      throw new ForbiddenException({
        statusCode: ENUM_USER_STATUS_CODE_ERROR.INACTIVE_FORBIDDEN,
        message: 'user.error.inactive',
      });
    }

    return user;
  }

  async updateAvatar(user: UserEntity, file: FileEntity): Promise<UserEntity> {
    user.avatar = file;

    return this.userRepository.save(user);
  }
}
