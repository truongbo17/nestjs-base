import { IResponse } from '../interfaces/response.interface';
import { HttpStatus } from '@nestjs/common';
import { Request } from 'express';

export function responseSuccess(input: IResponse, request: Request): IResponse {
  return {
    success: input.success ?? true,
    statusCode: input?.statusCode ?? HttpStatus.OK,
    message: input.message ?? 'Success',
    errors: input.errors ?? [],
    _metadata: request._metadata ?? {},
    data: input?.data ?? {},
  };
}
