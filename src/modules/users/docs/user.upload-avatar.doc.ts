import { applyDecorators } from '@nestjs/common';
import {
  Doc,
  DocAuth,
  DocRequestFile,
  DocResponse,
} from '../../../common/docs/decorators/doc.decorator';
import { UserUpdateResponseDto } from '../dtos/responses/user.update.response.dto';

export function UserUploadAvatarDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'Upload avatar user',
    }),
    DocAuth({ jwtAccessToken: true }),
    DocRequestFile({ fieldName: 'file' }),
    DocResponse('user.uploadPhotoProfile', { dto: UserUpdateResponseDto })
  );
}
