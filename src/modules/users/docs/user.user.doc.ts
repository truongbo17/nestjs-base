import { applyDecorators } from '@nestjs/common';
import { Doc, DocResponse } from '../../../core/docs/decorators/doc.decorator';

export function UserRegisterDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'Register new user',
    }),
    DocResponse('user.register'),
  );
}
