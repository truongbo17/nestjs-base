import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { RequestValidationException } from '../../request/exceptions/request.validation.exception';
import { LoggerService } from '../../logger/services/logger.service';
import { I18nLangService } from '../../i18n/services/i18n-lang.service';
import { AllConfigType } from '../../../config/config.type';
import { IRequestApp } from '../../request/interfaces/request.interface';
import dateHelper from '../../../utils/date.helper';
import { ENUM_MESSAGE_LANGUAGE } from '../../i18n/enums/i18n.enum';
import { ResponseMetadataDto } from '../../response/dtos/response.dto';
import { IAppException } from '../interfaces/app.interface';
import { IMessageValidationError } from '../../i18n/interfaces/i18n.interface';

@Catch(RequestValidationException)
export class AppValidationFilter implements ExceptionFilter {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly i18nService: I18nLangService,
    private readonly configService: ConfigService<AllConfigType>
  ) {}

  async catch(
    exception: RequestValidationException,
    host: ArgumentsHost
  ): Promise<void> {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response: Response = ctx.getResponse<Response>();
    const request: IRequestApp = ctx.getRequest<IRequestApp>();

    this.loggerService.log('error', exception, AppValidationFilter.name);

    // metadata
    const today: Date = dateHelper.create();
    const xLanguage: string =
      request.__language ??
      this.configService.getOrThrow<ENUM_MESSAGE_LANGUAGE>('app.appLanguage', {
        infer: true,
      });
    const xTimestamp = dateHelper.getTimestamp(today);
    const xTimezone = dateHelper.getZone(today);
    const xVersion =
      request.__version ??
      this.configService.getOrThrow<string>('app.urlVersion.version', {
        infer: true,
      });
    const xRepoVersion = this.configService.getOrThrow<string>(
      'app.repoVersion',
      {
        infer: true,
      }
    );
    const metadata: ResponseMetadataDto = {
      language: xLanguage,
      timestamp: xTimestamp,
      timezone: xTimezone,
      path: request.path,
      version: xVersion,
      repoVersion: xRepoVersion,
    };

    // set response
    const message = this.i18nService.setMessage(exception.message, {
      customLanguage: xLanguage,
    });
    const errors: IMessageValidationError[] =
      this.i18nService.setValidationMessage(exception.errors, {
        customLanguage: xLanguage,
      });

    const responseBody: IAppException = {
      statusCode: exception.statusCode,
      message,
      errors,
      _metadata: metadata,
    };

    response
      .setHeader('x-custom-lang', xLanguage)
      .setHeader('x-timestamp', xTimestamp)
      .setHeader('x-timezone', xTimezone)
      .setHeader('x-version', xVersion)
      .setHeader('x-repo-version', xRepoVersion)
      .status(exception.httpStatus)
      .json(responseBody);

    return;
  }
}
