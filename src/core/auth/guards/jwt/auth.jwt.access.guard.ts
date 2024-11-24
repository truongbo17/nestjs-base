import { AuthGuard } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthJwtAccessPayloadDto } from '../../dtos/jwt/auth.jwt.access-payload.dto';
import { ENUM_AUTH_STATUS_CODE_ERROR } from '../../enums/auth.status-code.enum';

@Injectable()
export class AuthJwtAccessGuard extends AuthGuard('jwtAccess') {
  handleRequest<T = AuthJwtAccessPayloadDto>(
    err: Error,
    user: T,
    info: Error
  ): T {
    if (err || !user) {
      throw new UnauthorizedException({
        statusCode: ENUM_AUTH_STATUS_CODE_ERROR.JWT_ACCESS_TOKEN,
        message: 'auth.error.accessTokenUnauthorized',
        _error: err ? err.message : info.message,
      });
    }

    return user;
  }
}
