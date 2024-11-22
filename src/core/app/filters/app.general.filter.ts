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
import { HttpAdapterHost } from '@nestjs/core';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { IRequestApp } from '../../../common/request/interfaces/request.interface';
import { ENUM_MESSAGE_LANGUAGE } from '../../../common/i18n/enums/i18n.enum';
import { ResponseMetadataDto } from '../../../common/response/dtos/response.dto';
import { IAppException } from '../interfaces/app.interface';
import { Response } from 'express';
import dateHelper from '../../../utils/date.helper';

@Catch()
export class AppGeneralFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly loggerService: LoggerService,
    private readonly i18nService: I18nLangService,
    private readonly configService: ConfigService<AllConfigType>
  ) {}

  async catch(exception: unknown, host: ArgumentsHost): Promise<void> {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response: Response = ctx.getResponse<Response>();
    const request: IRequestApp = ctx.getRequest<IRequestApp>();

    this.loggerService.log('error', exception, AppGeneralFilter.name);

    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      const statusHttp = exception.getStatus();

      httpAdapter.reply(ctx.getResponse(), response, statusHttp);
      return;
    }

    // set default
    const statusHttp: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    const messagePath = `http.${statusHttp}`;
    const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

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
    const metadata: ResponseMetadataDto = {
      language: xLanguage,
      timestamp: xTimestamp,
      timezone: xTimezone,
      path: request.path,
      version: xVersion,
      repoVersion: xRepoVersion,
    };

    const message: string = this.i18nService.setMessage(messagePath, {
      customLanguage: xLanguage,
    });

    const responseBody: IAppException = {
      statusCode,
      message,
      _metadata: metadata,
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
}
