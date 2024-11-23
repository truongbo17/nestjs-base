import { ValidationError } from 'class-validator';
import {
  IMessageValidationError,
  IMessageValidationImportError,
  IMessageValidationImportErrorParam,
} from '../../../common/i18n/interfaces/i18n.interface';
import { IResponseMetadata } from '../../../common/response/interfaces/response.interface';

export interface IAppException {
  success: boolean;
  statusCode: number;
  message: string;
  errors?: IMessageValidationError[] | ValidationError[];
  data?: Record<string, any>;
  _metadata?: IResponseMetadata;
}

export interface IAppImportException extends Omit<IAppException, 'errors'> {
  statusCode: number;
  message: string;
  errors?:
    | IMessageValidationImportErrorParam[]
    | IMessageValidationImportError[];
  data?: Record<string, any>;
  _metadata?: IResponseMetadata;
}
