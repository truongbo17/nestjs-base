import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from './config/app.config';
import { CommandService } from 'nestjs-command';
import { ScheduleModule } from '@nestjs/schedule';
import { ScheduleModule as ScheduleModuleManage } from './console/schedule/schedule.module';
import { BullModule } from '@nestjs/bullmq';
import queueConfig from './config/queue.config';
import viewConfig from './config/view.config';
import { RouterModule } from './routers/router.module';
import databaseConfig from './config/database.config';
import fileConfig from './config/file.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './common/database/typeorm-config.service';
import { DataSource, DataSourceOptions } from 'typeorm';
import { I18nLangModule } from './common/i18n/i18n-lang.module';
import { AppMiddlewareModule } from './core/app/app.middleware.module';
import middlewareConfig from './config/middleware.config';
import { LoggerModule } from './common/logger/logger.module';

@Module({
  imports: [
    // Logger
    LoggerModule.forRoot(true),
    // Config
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfig,
        queueConfig,
        viewConfig,
        databaseConfig,
        fileConfig,
        middlewareConfig,
      ],
      envFilePath: ['.env'],
    }), // Database MongoDB
    // MongooseModule.forRootAsync({
    //   connectionName: 'MONGOOSE_CONNECT',
    //   useClass: MongooseConfigService,
    // }),
    // Database ORM
    TypeOrmModule.forRootAsync({
      name: 'ORM_CONNECT',
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (
        options: DataSourceOptions | undefined
      ): Promise<DataSource> => {
        if (!options) {
          throw new Error('No Datasource options provided');
        }
        return await new DataSource(options).initialize();
      },
    }), // I18N
    I18nLangModule.forRootAsync(), // Schedule
    ScheduleModule.forRoot(),
    ScheduleModuleManage, // Queue
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }), //Middleware
    AppMiddlewareModule, // Router
    RouterModule, // Modules append...
  ],
  controllers: [],
  providers: [CommandService, Logger],
})
export class AppModule {}
