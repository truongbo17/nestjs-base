import { OmitType } from '@nestjs/swagger';
import { UserCreateRequestDto } from './user.create.request.dto';

export class UserUpdateRequestDto extends OmitType(UserCreateRequestDto, [
  'email',
] as const) {}
