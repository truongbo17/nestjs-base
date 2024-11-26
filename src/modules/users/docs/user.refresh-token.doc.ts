import { applyDecorators } from '@nestjs/common';
import {
  Doc,
  DocAuth,
  DocResponse,
} from '../../../common/docs/decorators/doc.decorator';
import { AuthRefreshResponseDto } from '../../../core/auth/dtos/response/auth.refresh.response.dto';

export function UserRefreshTokenDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'Refresh token',
    }),
    DocAuth({ jwtRefreshToken: true }),
    DocResponse<AuthRefreshResponseDto>('auth.refresh', {
      dto: AuthRefreshResponseDto,
    })
  );
}
