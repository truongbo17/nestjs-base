import { applyDecorators } from '@nestjs/common';
import {
  Doc,
  DocRequest,
  DocResponse,
} from '../../../common/docs/decorators/doc.decorator';
import { UserCreateResponseDto } from '../dtos/responses/user.create.response.dto';
import { ENUM_DOC_REQUEST_BODY_TYPE } from '../../../common/docs/enums/doc.enum';
import { AuthSignUpRequestDto } from '../../../core/auth/dtos/request/auth.sign-up.request.dto';

export function UserRegisterDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'Register new user',
    }),
    DocRequest({
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      dto: AuthSignUpRequestDto,
    }),
    DocResponse<UserCreateResponseDto>('user.register', {
      success: true,
      dto: UserCreateResponseDto,
    })
  );
}
