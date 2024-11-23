import { applyDecorators, SetMetadata, UseInterceptors } from '@nestjs/common';
import {
  RESPONSE_MESSAGE_PATH_META_KEY,
  RESPONSE_MESSAGE_PROPERTIES_META_KEY,
  RESPONSE_SUCCESS_META_KEY,
} from 'src/common/response/constants/response.constant';
import { ResponseInterceptor } from 'src/common/response/interceptors/response.interceptor';
import { IResponseOptions } from 'src/common/response/interfaces/response.interface';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';

export function Response(
  messagePath: string,
  options?: IResponseOptions
): MethodDecorator {
  const decorators: any = [
    UseInterceptors(ResponseInterceptor),
    SetMetadata(RESPONSE_MESSAGE_PATH_META_KEY, messagePath),
    SetMetadata(
      RESPONSE_MESSAGE_PROPERTIES_META_KEY,
      options?.messageProperties
    ),
    SetMetadata(RESPONSE_SUCCESS_META_KEY, options?.success ?? true),
  ];

  if (options?.cached) {
    decorators.push(UseInterceptors(CacheInterceptor));

    if (typeof options?.cached !== 'boolean') {
      if (options?.cached?.key) {
        decorators.push(CacheKey(options?.cached?.key));
      }

      if (options?.cached?.ttl) {
        decorators.push(CacheTTL(options?.cached?.ttl));
      }
    }
  }

  return applyDecorators(...decorators);
}
