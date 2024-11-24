import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  UseGuards,
} from '@nestjs/common';
import { IRequestApp } from 'src/common/request/interfaces/request.interface';
import { AuthJwtAccessPayloadDto } from '../dtos/jwt/auth.jwt.access-payload.dto';
import { AuthJwtAccessGuard } from '../guards/jwt/auth.jwt.access.guard';
import { AuthJwtRefreshGuard } from '../guards/jwt/auth.jwt.refresh.guard';

export const AuthJwtPayload = createParamDecorator(
  <T = AuthJwtAccessPayloadDto>(
    data: keyof T,
    ctx: ExecutionContext
  ): T[keyof T] | T => {
    const request = ctx.switchToHttp().getRequest<IRequestApp & { user?: T }>();
    const user = request.user;

    if (!user) {
      throw new Error('User is not defined');
    }

    return data ? user[data] : user;
  }
);

export const AuthJwtToken = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): string | unknown => {
    const { headers } = ctx.switchToHttp().getRequest<IRequestApp>();
    const { authorization } = headers;
    const authorizations: string[] = authorization?.split(' ') ?? [];

    return authorizations.length >= 2 ? authorizations[1] : undefined;
  }
);

export function AuthJwtAccessProtected(): MethodDecorator {
  return applyDecorators(UseGuards(AuthJwtAccessGuard));
}

export function AuthJwtRefreshProtected(): MethodDecorator {
  return applyDecorators(UseGuards(AuthJwtRefreshGuard));
}
