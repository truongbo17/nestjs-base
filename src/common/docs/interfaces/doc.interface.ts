import { HttpStatus } from '@nestjs/common';
import { ApiParamOptions, ApiQueryOptions } from '@nestjs/swagger';
import { ClassConstructor } from 'class-transformer';
import { ENUM_DOC_REQUEST_BODY_TYPE } from '../enums/doc.enum';
import { ENUM_FILE_MIME } from '../../files/enums/file.enum';

export interface IDocOptions {
  summary?: string;
  operation?: string;
  deprecated?: boolean;
  description?: string;
}

export interface IDocOfOptions<T = any> {
  success: boolean;
  statusCode: number;
  messagePath: string;
  dto?: ClassConstructor<T>;
  data: object;
}

export interface IDocDefaultOptions<T = any> extends IDocOfOptions<T> {
  httpStatus: HttpStatus;
}

export interface IDocAuthOptions {
  jwtAccessToken?: boolean;
  jwtRefreshToken?: boolean;
  google?: boolean;
}

export interface IDocRequestOptions<T = any> {
  params?: ApiParamOptions[];
  queries?: ApiQueryOptions[];
  bodyType?: ENUM_DOC_REQUEST_BODY_TYPE;
  dto?: ClassConstructor<T>;
}

export type IDocRequestFileOptions = Omit<IDocRequestOptions, 'bodyType'> & {
  fieldName?: string;
};

export interface IDocGuardOptions {
  policy?: boolean;
  role?: boolean;
}

export interface IDocResponseOptions<T = any> {
  success?: boolean;
  statusCode?: number;
  httpStatus?: HttpStatus;
  dto?: ClassConstructor<T>;
  data?: object;
}

export interface IDocResponseFileOptions
  extends Omit<IDocResponseOptions, 'dto' | 'statusCode'> {
  fileType?: ENUM_FILE_MIME;
}
