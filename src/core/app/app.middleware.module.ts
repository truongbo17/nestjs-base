import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AppGeneralFilter } from './filters/app.general.filter';
import { AppHttpFilter } from './filters/app.http.filter';
import { AppValidationFilter } from './filters/app.validation.filter';
import {
  AppJsonBodyParserMiddleware,
  AppRawBodyParserMiddleware,
  AppTextBodyParserMiddleware,
  AppUrlencodedBodyParserMiddleware,
} from './middlewares/app.body-parser.middleware';
import { AppCorsMiddleware } from './middlewares/app.cors.middleware';
import { AppCustomLanguageMiddleware } from './middlewares/app.custom-language.middleware';
import { AppHelmetMiddleware } from './middlewares/app.helmet.middleware';
import { AppRequestIdMiddleware } from './middlewares/app.request-id.middleware';
import { AppResponseTimeMiddleware } from './middlewares/app.response-time.middleware';
import { AppUrlVersionMiddleware } from './middlewares/app.url-version.middleware';

@Module({
  controllers: [],
  exports: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AppGeneralFilter,
    },
    {
      provide: APP_FILTER,
      useClass: AppHttpFilter,
    },
    {
      provide: APP_FILTER,
      useClass: AppValidationFilter,
    },
  ],
})
export class AppMiddlewareModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(
        // RequestLoggerMiddleware,
        AppJsonBodyParserMiddleware,
        AppTextBodyParserMiddleware,
        AppRawBodyParserMiddleware,
        AppUrlencodedBodyParserMiddleware,
        AppCorsMiddleware,
        AppCustomLanguageMiddleware,
        AppHelmetMiddleware,
        AppRequestIdMiddleware,
        AppResponseTimeMiddleware,
        AppUrlVersionMiddleware
        // FileUploadLimitMiddleware
      )
      .forRoutes('*');
  }
}
