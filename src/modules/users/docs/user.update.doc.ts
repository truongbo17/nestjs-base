import { applyDecorators } from '@nestjs/common';
import {
  Doc,
  DocAuth,
  DocRequest,
  DocResponse,
} from '../../../common/docs/decorators/doc.decorator';
import { ENUM_DOC_REQUEST_BODY_TYPE } from '../../../common/docs/enums/doc.enum';
import { UserUpdateRequestDto } from '../dtos/requests/user.update.request.dto';
import { UserUpdateResponseDto } from '../dtos/responses/user.update.response.dto';

export function UserUpdateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'User update info',
    }),
    DocAuth({ jwtAccessToken: true }),
    DocRequest({
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      dto: UserUpdateRequestDto,
    }),
    DocResponse('auth.updateInfo', { dto: UserUpdateResponseDto })
  );
}
