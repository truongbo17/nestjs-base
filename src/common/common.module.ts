import { Logger, Module } from '@nestjs/common';
import { LoggerModule } from './logger/logger.module';
import { ConfigModule } from '@nestjs/config';
import appConfig from '../config/app.config';
import queueConfig from '../config/queue.config';
import viewConfig from '../config/view.config';
import databaseConfig from '../config/database.config';
import fileConfig from '../config/file.config';
import middlewareConfig from '../config/middleware.config';
import { I18nLangModule } from './i18n/i18n-lang.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ScheduleModule as ScheduleModuleManage } from '../console/schedule/schedule.module';
import { CommandService } from 'nestjs-command';
import redisConfig from '../config/redis.config';
import mailConfig from '../config/mail.config';
import { CacheModule } from './cache/cache.module';
import { QueueModule } from './queue/queue.module';
import { FileModule } from './files/file.module';

@Module({
  controllers: [],
  providers: [CommandService, Logger],
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
        redisConfig,
        mailConfig,
      ],
      envFilePath: ['.env'],
    }),
    // I18N
    I18nLangModule.forRootAsync(),
    // Schedule
    ScheduleModule.forRoot(),
    ScheduleModuleManage,
    // Queue
    QueueModule,
    // Cache
    CacheModule,
    // File
    FileModule,
  ],
})
export class CommonModule {}
