import { OmitType } from '@nestjs/swagger';
import { AuthJwtAccessPayloadDto } from './auth.jwt.access-payload.dto';

export class AuthJwtRefreshPayloadDto extends OmitType(
  AuthJwtAccessPayloadDto,
  ['email'] as const
) {}
