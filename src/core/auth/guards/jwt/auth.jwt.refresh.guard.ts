import { AuthGuard } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ENUM_AUTH_STATUS_CODE_ERROR } from '../../enums/auth.status-code.enum';
import { AuthJwtRefreshPayloadDto } from '../../dtos/jwt/auth.jwt.refresh-payload.dto';

@Injectable()
export class AuthJwtRefreshGuard extends AuthGuard('jwtRefresh') {
  handleRequest<T = AuthJwtRefreshPayloadDto>(
    err: Error,
    user: T,
    info: Error
  ): T {
    if (err || !user) {
      throw new UnauthorizedException({
        statusCode: ENUM_AUTH_STATUS_CODE_ERROR.JWT_REFRESH_TOKEN,
        message: 'auth.error.refreshTokenUnauthorized',
        _error: err ? err.message : info.message,
      });
    }

    return user;
  }
}
