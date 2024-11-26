import { UserServiceInterface } from '../interfaces/user.service.interface';
import { Injectable } from '@nestjs/common';
import { IAuthPassword } from '../../../core/auth/interfaces/auth.interface';
import { UserEntity } from '../repository/entities/user.entity';
import { ENUM_USER_STATUS } from '../enums/user.enum';
import { UserRepository } from '../repository/repositories/user.repository';
import { UserCreateRequestDto } from '../dtos/requests/user.create.request.dto';
import { UserUpdateRequestDto } from '../dtos/requests/user.update.request.dto';

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
    { passwordExpired, passwordHash, salt, passwordCreated }: IAuthPassword
  ): Promise<UserEntity> {
    const user = new UserEntity();
    user.email = email;
    user.name = name;
    user.gender = gender;
    user.status = ENUM_USER_STATUS.ACTIVE;
    user.password = passwordHash;

    return this.userRepository.create(user);
  }

  async updatePassword(
    user: UserEntity,
    { passwordExpired, passwordHash, salt, passwordCreated }: IAuthPassword
  ) {
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
}
