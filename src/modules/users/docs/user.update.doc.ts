import { applyDecorators } from '@nestjs/common';
import {
  Doc,
  DocAuth,
  DocRequest,
  DocResponse,
} from '../../../common/docs/decorators/doc.decorator';
import { ENUM_DOC_REQUEST_BODY_TYPE } from '../../../common/docs/enums/doc.enum';
import { AuthChangePasswordRequestDto } from '../../../core/auth/dtos/request/auth.change-password.request.dto';

export function UserUpdateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'User change password',
    }),
    DocAuth({ jwtAccessToken: true }),
    DocRequest({
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      dto: AuthChangePasswordRequestDto,
    }),
    DocResponse('auth.changePassword')
  );
}
