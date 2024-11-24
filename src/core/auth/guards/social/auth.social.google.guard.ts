import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { IRequestApp } from 'src/common/request/interfaces/request.interface';
import { AuthService } from '../../services/auth.service';
import { AuthSocialGooglePayloadDto } from '../../dtos/social/auth.social.google-payload.dto';
import { ENUM_AUTH_STATUS_CODE_ERROR } from '../../enums/auth.status-code.enum';

@Injectable()
export class AuthSocialGoogleGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<IRequestApp<AuthSocialGooglePayloadDto>>();
    const { authorization } = request.headers;
    const acArr = authorization?.split('Bearer ') ?? [];
    if (acArr.length !== 2) {
      throw new UnauthorizedException({
        statusCode: ENUM_AUTH_STATUS_CODE_ERROR.SOCIAL_GOOGLE,
        message: 'auth.error.socialGoogle',
      });
    }

    const accessToken: string = acArr[1];

    try {
      const payload: AuthSocialGooglePayloadDto =
        await this.authService.googleGetTokenInfo(accessToken);

      request.user = {
        email: payload.email,
      };

      return true;
    } catch (err: any) {
      throw new UnauthorizedException({
        statusCode: ENUM_AUTH_STATUS_CODE_ERROR.SOCIAL_GOOGLE,
        message: 'auth.error.socialGoogle',
        _error: err.message,
      });
    }
  }
}
