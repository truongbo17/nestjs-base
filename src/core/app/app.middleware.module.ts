import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RequestLoggerMiddleware } from './middlewares/request-logger.middleware';
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
        RequestLoggerMiddleware,
        AppJsonBodyParserMiddleware,
        AppTextBodyParserMiddleware,
        AppRawBodyParserMiddleware,
        AppUrlencodedBodyParserMiddleware,
        AppCorsMiddleware
      )
      .forRoutes('*');
  }
}
