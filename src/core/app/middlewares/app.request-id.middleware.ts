import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '../../../config/config.type';
import { ENUM_MESSAGE_LANGUAGE } from '../../../common/i18n/enums/i18n.enum';
import dateHelper from '../../../utils/date.helper';

@Injectable()
export class AppRequestIdMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService<AllConfigType>) {}

  use(req: Request, _res: Response, next: NextFunction): void {
    req.id = uuid();

    const today: Date = dateHelper.create();
    const xLanguage: string =
      req.__language ??
      this.configService.getOrThrow<ENUM_MESSAGE_LANGUAGE>('app.appLanguage', {
        infer: true,
      });
    const xTimestamp = dateHelper.getTimestamp(today);
    const xTimezone = dateHelper.getZone(today);
    const xVersion =
      req.__version ??
      this.configService.getOrThrow<string>('app.urlVersion.version', {
        infer: true,
      });
    const xRepoVersion = this.configService.getOrThrow<string>(
      'app.repoVersion',
      {
        infer: true,
      }
    );
    req._metadata = {
      language: xLanguage,
      timestamp: xTimestamp,
      timezone: xTimezone,
      path: req.path,
      version: xVersion,
      repoVersion: xRepoVersion,
    };

    next();
  }
}
