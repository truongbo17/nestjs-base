import { ValidationError } from '@nestjs/common';
import {
  IMessageErrorOptions,
  IMessageSetOptions,
  IMessageValidationError,
  IMessageValidationImportError,
  IMessageValidationImportErrorParam,
} from './i18n.interface';

export interface I18nServiceInterface {
  filterLanguage(customLanguage: string): string[];

  setMessage(path: string, options?: IMessageSetOptions): string;

  setValidationMessage(
    errors: ValidationError[],
    options?: IMessageErrorOptions
  ): IMessageValidationError[];

  setValidationImportMessage(
    errors: IMessageValidationImportErrorParam[],
    options?: IMessageErrorOptions
  ): IMessageValidationImportError[];
}
