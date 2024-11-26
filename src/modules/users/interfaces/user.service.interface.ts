import { UserEntity } from '../repository/entities/user.entity';
import { UserCreateRequestDto } from '../dtos/requests/user.create.request.dto';
import { IAuthPassword } from '../../../core/auth/interfaces/auth.interface';

export interface UserServiceInterface {
  existByEmail(email: string): Promise<boolean>;

  findOneById(id: number): Promise<UserEntity | null>;

  findOneByEmail(email: string): Promise<UserEntity | null>;

  create(
    { email, name, gender }: UserCreateRequestDto,
    { passwordExpired, passwordHash, salt, passwordCreated }: IAuthPassword
  ): Promise<UserEntity>;
}
