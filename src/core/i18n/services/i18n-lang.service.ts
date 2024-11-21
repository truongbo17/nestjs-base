import { I18nContext, I18nService } from 'nestjs-i18n';
import arrayHelpers from '../../../utils/array.helpers';
import { Injectable, ValidationError } from '@nestjs/common';
import { I18nServiceInterface } from '../interfaces/i18n.service.interface';
import {
  IMessageErrorOptions,
  IMessageSetOptions,
  IMessageValidationError,
  IMessageValidationImportError,
  IMessageValidationImportErrorParam,
} from '../interfaces/i18n.interface';
import { ENUM_MESSAGE_LANGUAGE } from '../enums/i18n.enum';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class I18nLangService implements I18nServiceInterface {
  private readonly defaultLanguage: ENUM_MESSAGE_LANGUAGE;
  private readonly availableLanguage: ENUM_MESSAGE_LANGUAGE[];

  constructor(
    private readonly i18n: I18nService,
    private readonly configService: ConfigService
  ) {
    this.defaultLanguage = this.configService.getOrThrow<string>(
      'app.appLanguage',
      { infer: true }
    ) as ENUM_MESSAGE_LANGUAGE;
    this.availableLanguage = this.configService.get<ENUM_MESSAGE_LANGUAGE[]>(
      'message.availableLanguage'
    ) as ENUM_MESSAGE_LANGUAGE[];
  }

  //! Filter message base on available language
  filterLanguage(customLanguage: string): string[] {
    return arrayHelpers.getIntersection(
      [customLanguage],
      this.availableLanguage
    );
  }

  //! set message by path  base on language
  setMessage(path: string, options?: IMessageSetOptions): string {
    const language: string = options?.customLanguage
      ? this.filterLanguage(options.customLanguage)[0]
      : this.defaultLanguage;

    return this.i18n.translate(path, {
      lang: language,
      args: options?.properties,
    }) as any;
  }

  setValidationMessage(
    errors: ValidationError[],
    options?: IMessageErrorOptions
  ): IMessageValidationError[] {
    const messages: IMessageValidationError[] = [];
    for (const error of errors) {
      const property = error.property;
      const constraints: string[] = Object.keys(error.constraints ?? []);

      if (constraints.length === 0) {
        messages.push({
          property,
          message: this.setMessage('request.unknownMessage', {
            customLanguage: options?.customLanguage,
            properties: {
              property,
              value: error.value,
            },
          }),
        });

        continue;
      }

      for (const constraint of constraints) {
        const message = this.setMessage(`request.${constraint}`, {
          customLanguage: options?.customLanguage,
          properties: {
            property,
            value: error.value,
          },
        });

        messages.push({
          property,
          message: message,
        });
      }
    }

    return messages;
  }

  setValidationImportMessage(
    errors: IMessageValidationImportErrorParam[],
    options?: IMessageErrorOptions
  ): IMessageValidationImportError[] {
    return errors.map(val => ({
      row: val.row,
      sheetName: val.sheetName,
      errors: this.setValidationMessage(val.errors, options),
    }));
  }

  async tran(
    keys: string | string[],
    throwException: boolean = true
  ): Promise<Awaited<unknown>[]> {
    const i18n: I18nContext<Record<any, any>> | undefined =
      I18nContext.current();
    if (i18n) {
      return Promise.all(
        arrayHelpers.wrapArray(keys).map(async key => {
          return i18n.t(key);
        })
      );
    }

    if (throwException) {
      throw new Error('I18N feature is currently unavailable.');
    }

    return [];
  }
}
