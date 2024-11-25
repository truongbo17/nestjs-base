import { applyDecorators } from '@nestjs/common';
import {
  Doc,
  DocAuth,
  DocRequest,
  DocResponse,
} from '../../../common/docs/decorators/doc.decorator';
import { AuthLoginResponseDto } from '../../../core/auth/dtos/response/auth.login.response.dto';
import { AuthLoginRequestDto } from '../../../core/auth/dtos/request/auth.login.request.dto';
import { ENUM_DOC_REQUEST_BODY_TYPE } from '../../../common/docs/enums/doc.enum';

export function UserLoginCredentialDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'Login with email and password',
    }),
    DocRequest({
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      dto: AuthLoginRequestDto,
    }),
    DocResponse<AuthLoginResponseDto>('auth.loginWithCredential', {
      dto: AuthLoginResponseDto,
    })
  );
}

export function UserLoginSocialGoogleDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'Login with social google',
    }),
    DocAuth({ google: true }),
    DocResponse<AuthLoginResponseDto>('auth.loginWithSocialGoogle', {
      dto: AuthLoginResponseDto,
    })
  );
}
