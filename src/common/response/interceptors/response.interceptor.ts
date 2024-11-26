import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Response } from 'express';
import { Reflector } from '@nestjs/core';
import { IRequestApp } from 'src/common/request/interfaces/request.interface';
import {
  RESPONSE_MESSAGE_PATH_META_KEY,
  RESPONSE_MESSAGE_PROPERTIES_META_KEY,
  RESPONSE_SUCCESS_META_KEY,
} from 'src/common/response/constants/response.constant';
import {
  IResponse,
  ResponseInterceptorInterface,
} from 'src/common/response/interfaces/response.interface';
import {
  ResponseDto,
  ResponseMetadataDto,
} from 'src/common/response/dtos/response.dto';
import { ConfigService } from '@nestjs/config';
import { I18nLangService } from '../../i18n/services/i18n-lang.service';
import { IMessageOptionsProperties } from '../../i18n/interfaces/i18n.interface';
import dateHelper from '../../../utils/date.helper';
import { ENUM_MESSAGE_LANGUAGE } from '../../i18n/enums/i18n.enum';

@Injectable()
export class ResponseInterceptor
  implements NestInterceptor<Promise<ResponseDto>>
{
  constructor(
    private readonly reflector: Reflector,
    private readonly i18nService: I18nLangService,
    private readonly configService: ConfigService
  ) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<Promise<ResponseDto>> {
    if (context.getType() === 'http') {
      return next.handle().pipe(
        map(async (res: Promise<any>) => {
          const ctx: HttpArgumentsHost = context.switchToHttp();
          const response: Response = ctx.getResponse();
          const request: IRequestApp = ctx.getRequest<IRequestApp>();

          let messagePath: string = this.reflector.get<string>(
            RESPONSE_MESSAGE_PATH_META_KEY,
            context.getHandler()
          );
          const success: boolean = this.reflector.get<boolean>(
            RESPONSE_SUCCESS_META_KEY,
            context.getHandler()
          );
          let messageProperties: IMessageOptionsProperties =
            this.reflector.get<IMessageOptionsProperties>(
              RESPONSE_MESSAGE_PROPERTIES_META_KEY,
              context.getHandler()
            );

          // set default response
          let httpStatus: HttpStatus = response.statusCode;
          let statusCode: number = response.statusCode;
          let data: Record<string, any> = {};

          // metadata
          const today = dateHelper.create();
          const xPath = request.path;
          const xLanguage: string =
            request.__language ??
            this.configService.get<ENUM_MESSAGE_LANGUAGE>('app.appLanguage');
          const xTimestamp = dateHelper.getTimestamp(today);
          const xTimezone = dateHelper.getZone(today);
          const xVersion =
            request.__version ??
            this.configService.get<string>('app.urlVersion.version');
          const xRepoVersion =
            this.configService.get<string>('app.repoVersion');
          let metadata: ResponseMetadataDto = {
            language: xLanguage,
            timestamp: xTimestamp,
            timezone: xTimezone,
            path: xPath,
            version: xVersion,
            repoVersion: xRepoVersion,
          };

          // response
          const responseData = (await res) as ResponseInterceptorInterface;

          if (responseData.data) {
            const { _metadata } = responseData;

            data = responseData.data;
            httpStatus = _metadata?.customProperty?.httpStatus ?? httpStatus;
            statusCode = _metadata?.customProperty?.statusCode ?? statusCode;
            messagePath = _metadata?.customProperty?.message ?? messagePath;
            messageProperties =
              _metadata?.customProperty?.messageProperties ?? messageProperties;

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

          response.setHeader('x-custom-lang', xLanguage);
          response.setHeader('x-timestamp', xTimestamp);
          response.setHeader('x-timezone', xTimezone);
          if (xVersion) {
            response.setHeader('x-version', xVersion);
          }
          if (xRepoVersion) {
            response.setHeader('x-repo-version', xRepoVersion);
          }
          response.status(httpStatus);

          return {
            success: success,
            statusCode,
            message,
            _metadata: metadata,
            data,
          };
        })
      );
    }

    return next.handle();
  }
}
