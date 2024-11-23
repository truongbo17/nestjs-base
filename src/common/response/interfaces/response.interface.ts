import { HttpStatus } from '@nestjs/common';
import { IMessageOptionsProperties } from '../../i18n/interfaces/i18n.interface';

export interface IResponseCustomProperty {
  statusCode?: number;
  message?: string;
  httpStatus?: HttpStatus;
  messageProperties?: IMessageOptionsProperties;
}

// metadata
export interface IResponseMetadata {
  customProperty?: IResponseCustomProperty;

  [key: string]: any;
}

// decorator options
export interface IResponseOptions {
  messageProperties?: IMessageOptionsProperties;
  cached?: IResponseCacheOptions | boolean;
}

// response
export interface IResponse {
  success: boolean;
  statusCode: HttpStatus.OK;
  message: string;
  errors?: [];
  _metadata?: IResponseMetadata;
  data?: object;
}

// response pagination
export interface IResponsePagingPagination {
  totalPage: number;
  total: number;
}

export interface IResponsePaging<T> {
  _metadata?: IResponseMetadata;
  _pagination: IResponsePagingPagination;
  data: T[];
}

// cached
export interface IResponseCacheOptions {
  key?: string;
  ttl?: number;
}
