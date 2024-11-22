import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RequestLoggerMiddleware } from './middlewares/request-logger.middleware';
import { APP_FILTER } from '@nestjs/core';
import { AppGeneralFilter } from './filters/app.general.filter';
import { AppHttpFilter } from './filters/app.http.filter';

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
  ],
})
export class AppMiddlewareModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
