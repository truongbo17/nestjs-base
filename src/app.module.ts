import { Logger, MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from './config/app.config';
import { HeaderResolver, I18nModule } from 'nestjs-i18n';
import { AllConfigType } from './config/config.type';
import { UsersModule } from './modules/users/users.module';
import * as path from 'node:path';
import { CommandModule, CommandService } from 'nestjs-command';
import { AppCommandModule } from './console/command/app.command.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ScheduleModule as ScheduleModuleManage } from './console/schedule/schedule.module';
import { BullModule } from '@nestjs/bullmq';
import queueConfig from './config/queue.config';
import viewConfig from './config/view.config';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { format, transports } from 'winston';
import 'winston-daily-rotate-file';
import { RequestLoggerMiddleware } from './middlewares/request-logger.middleware';
import { RouterModule } from './routers/router.module';

@Module({
  imports: [
    // Config
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, queueConfig, viewConfig],
      envFilePath: ['.env'],
    }),
    // I18N
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService<AllConfigType>) => ({
        fallbackLanguage: configService.getOrThrow('app.fallbackLanguage', {
          infer: true,
        }),
        loaderOptions: { path: path.join(__dirname, '/lang/'), watch: true },
      }),
      resolvers: [
        {
          use: HeaderResolver,
          useFactory: (
            configService: ConfigService<AllConfigType>,
          ): [string] => {
            return [
              configService.getOrThrow('app.headerLanguage', { infer: true }),
            ];
          },
          inject: [ConfigService],
        },
      ],
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    // Command
    CommandModule,
    AppCommandModule,
    // GetCurrentVersionSchedule
    ScheduleModule.forRoot(),
    ScheduleModuleManage,
    // Queue
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    // Logger
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp({
              format: 'YYYY-MM-DD HH:mm:ss',
            }),
            winston.format.colorize({ all: true }),
            winston.format.printf(({ timestamp, level, message, context }) => {
              return `${timestamp} \x1b[36m[${context || 'HttpApplication'} - Http]\x1b[0m ${level}: ${message}`;
            }),
          ),
        }),
        // same for all levels
        new transports.DailyRotateFile({
          filename: `logs/%DATE%.log`,
          format: format.combine(
            winston.format.timestamp({
              format: 'YYYY-MM-DD HH:mm:ss',
            }),
            format.json(),
          ),
          datePattern: 'YYYY-MM-DD',
          zippedArchive: false,
          maxFiles: '30d',
        }),
      ],
    }),
    // Router
    RouterModule,
    // Modules append
    UsersModule,
  ],
  controllers: [],
  providers: [CommandService, Logger],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
