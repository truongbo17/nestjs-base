import { applyDecorators } from '@nestjs/common';
import { Doc, DocAuth } from '../../../common/docs/decorators/doc.decorator';

export function UserUploadAvatarDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'Upload avatar user',
    }),
    DocAuth({ jwtAccessToken: true })
  );
}
