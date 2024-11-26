import { applyDecorators } from '@nestjs/common';
import {
  Doc,
  DocAuth,
  DocResponse,
} from '../../../common/docs/decorators/doc.decorator';
import { UserMeResponseDto } from '../dtos/responses/user.me.response.dto';

export function UserMeDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'User get me',
    }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse<UserMeResponseDto>('auth.loginWithSocialGoogle', {
      dto: UserMeResponseDto,
    })
  );
}
