import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NextFunction, Response } from 'express';
import { IRequestApp } from '../../../common/request/interfaces/request.interface';
import arrayHelper from '../../../utils/array.helper';
import { ENUM_MESSAGE_LANGUAGE } from '../../../common/i18n/enums/i18n.enum';

@Injectable()
export class AppCustomLanguageMiddleware implements NestMiddleware {
  private readonly availableLanguage: ENUM_MESSAGE_LANGUAGE[];

  constructor(private readonly configService: ConfigService) {
    this.availableLanguage = this.configService.getOrThrow<
      ENUM_MESSAGE_LANGUAGE[]
    >('app.availableLanguage');
  }

  async use(
    req: IRequestApp,
    _res: Response,
    next: NextFunction
  ): Promise<void> {
    let customLang: string = this.configService.getOrThrow<string>(
      'app.appLanguage',
      { infer: true }
    );

    const reqLanguages: string = req.headers['x-custom-lang'] as string;
    if (reqLanguages) {
      const language: string[] = this.filterLanguage(reqLanguages);

      if (language.length > 0) {
        customLang = reqLanguages;
      }
    }

    req.__language = customLang;
    req.headers['x-custom-lang'] = customLang;

    next();
  }

  private filterLanguage(customLanguage: string): string[] {
    return arrayHelper.getIntersection(
      [customLanguage],
      this.availableLanguage
    );
  }
}
