import { Logger, MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from './config/app.config';
import { CommandService } from 'nestjs-command';
import { ScheduleModule } from '@nestjs/schedule';
import { ScheduleModule as ScheduleModuleManage } from './console/schedule/schedule.module';
import { BullModule } from '@nestjs/bullmq';
import queueConfig from './config/queue.config';
import viewConfig from './config/view.config';
import { RequestLoggerMiddleware } from './middlewares/request-logger.middleware';
import { RouterModule } from './routers/router.module';
import { LoggerModule } from './core/logger/logger.module';
import databaseConfig from './config/database.config';
import fileConfig from './config/file.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './core/database/typeorm-config.service';
import { DataSource, DataSourceOptions } from 'typeorm';
import { I18nLangModule } from './core/i18n/i18n-lang.module';

@Module({
  imports: [
    // Logger
    LoggerModule.forRoot(true),
    // Config
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, queueConfig, viewConfig, databaseConfig, fileConfig],
      envFilePath: ['.env'],
    }),
    // Database MongoDB
    // MongooseModule.forRootAsync({
    //   connectionName: 'MONGOOSE_CONNECT',
    //   useClass: MongooseConfigService,
    // }),
    // Database ORM
    TypeOrmModule.forRootAsync({
      name: 'ORM_CONNECT',
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (
        options: DataSourceOptions | undefined,
      ): Promise<DataSource> => {
        if (!options) {
          throw new Error('No Datasource options provided');
        }
        return await new DataSource(options).initialize();
      },
    }),
    // I18N
    I18nLangModule.forRootAsync(),
    // Schedule
    ScheduleModule.forRoot(),
    ScheduleModuleManage,
    // Queue
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    // Router
    RouterModule,
    // Modules append...
  ],
  controllers: [],
  providers: [CommandService, Logger],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
