import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { LoggerService } from '../../../common/logger/services/logger.service';
import { I18nLangService } from '../../../common/i18n/services/i18n-lang.service';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '../../../config/config.type';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { IRequestApp } from '../../../common/request/interfaces/request.interface';
import { IMessageOptionsProperties } from '../../../common/i18n/interfaces/i18n.interface';
import dateHelper from '../../../utils/date.helper';
import { ENUM_MESSAGE_LANGUAGE } from '../../../common/i18n/enums/i18n.enum';
import { ResponseMetadataDto } from '../../../common/response/dtos/response.dto';
import { IAppException } from '../interfaces/app.interface';
import { Response } from 'express';

@Catch(HttpException)
export class AppHttpFilter implements ExceptionFilter {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly i18nService: I18nLangService,
    private readonly configService: ConfigService<AllConfigType>
  ) {}

  async catch(exception: HttpException, host: ArgumentsHost): Promise<void> {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response: Response = ctx.getResponse<Response>();
    const request: IRequestApp = ctx.getRequest<IRequestApp>();

    this.loggerService.log('error', exception, AppHttpFilter.name);

    // if (!request.path.startsWith('api') && !request.path.startsWith('docs')) {
    //   response.redirect(HttpStatus.PERMANENT_REDIRECT, '/api/public/hello');
    //
    //   return;
    // }

    // set default
    let statusHttp: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let messagePath = `http.${statusHttp}`;
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let messageProperties: IMessageOptionsProperties | undefined;
    let data: Record<string, any> | undefined;

    // metadata
    const today = dateHelper.create();
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
    let metadata: ResponseMetadataDto = {
      language: xLanguage,
      timestamp: xTimestamp,
      timezone: xTimezone,
      path: request.path,
      version: xVersion,
      repoVersion: xRepoVersion,
    };

    // Restructure
    const responseException = exception.getResponse();
    statusHttp = exception.getStatus();
    messagePath = `http.${statusHttp}`;
    statusCode = exception.getStatus();

    if (this.isErrorException(responseException)) {
      const { _metadata } = responseException;

      statusCode = responseException.statusCode;
      messagePath = responseException.message;
      data = responseException?.data || {};
      messageProperties = _metadata?.customProperty?.messageProperties;
      delete _metadata?.customProperty;

      metadata = {
        ...metadata,
        ..._metadata,
      };
    }

    const message: string = this.i18nService.setMessage(messagePath, {
      customLanguage: xLanguage,
      properties: messageProperties,
    });

    const responseBody: IAppException = {
      success: false,
      statusCode,
      message,
      _metadata: metadata,
      data,
    };

    response
      .setHeader('x-custom-lang', xLanguage)
      .setHeader('x-timestamp', xTimestamp)
      .setHeader('x-timezone', xTimezone)
      .setHeader('x-version', xVersion)
      .setHeader('x-repo-version', xRepoVersion)
      .status(statusHttp)
      .json(responseBody);

    return;
  }

  private isErrorException(obj: any): obj is IAppException {
    return typeof obj === 'object'
      ? 'statusCode' in obj && 'message' in obj
      : false;
  }
}
