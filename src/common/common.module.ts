import { Logger, Module } from '@nestjs/common';
import { LoggerModule } from './logger/logger.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig, { ENUM_CACHE_STORE } from '../config/app.config';
import queueConfig from '../config/queue.config';
import viewConfig from '../config/view.config';
import databaseConfig from '../config/database.config';
import fileConfig from '../config/file.config';
import middlewareConfig from '../config/middleware.config';
import { I18nLangModule } from './i18n/i18n-lang.module';
import { BullModule } from '@nestjs/bullmq';
import { ScheduleModule } from '@nestjs/schedule';
import { ScheduleModule as ScheduleModuleManage } from '../console/schedule/schedule.module';
import { CommandService } from 'nestjs-command';
import redisConfig from '../config/redis.config';
import { CacheModule, CacheOptions, CacheStore } from '@nestjs/cache-manager';
import { RedisStore, redisStore } from 'cache-manager-redis-store';
import mailConfig from '../config/mail.config';

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
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('redis.queue.host'),
          port: configService.get<number>('redis.queue.port'),
          username: configService.get<string>('redis.queue.username'),
          password: configService.get<string>('redis.queue.password'),
          tls: configService.get<any>('redis.queue.tls'),
        },
        defaultJobOptions: {
          backoff: {
            type: 'exponential',
            delay: 3000,
          },
          attempts: 3,
        },
      }),
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (
        configService: ConfigService
      ): Promise<CacheOptions> => {
        const storeCache: string = <string>configService.get('app.cacheStore', {
          infer: true,
        });

        if (storeCache === ENUM_CACHE_STORE.REDIS) {
          const store: RedisStore = await redisStore({
            socket: {
              host: configService.get<string>('redis.cached.host'),
              port: configService.get<number>('redis.cached.port'),
              tls: configService.get<boolean>('redis.cached.tls'),
            },
            username: configService.get<string>('redis.cached.username'),
            password: configService.get<string>('redis.cached.password'),
          });

          return {
            store: store as any as CacheStore,
            max: configService.get<number>('redis.cached.max'),
            ttl: configService.get<number>('redis.cached.ttl'),
          };
        } else {
          return {
            max: configService.get<number>('redis.cached.max'),
            ttl: configService.get<number>('redis.cached.ttl'),
          };
        }
      },
      inject: [ConfigService],
    }),
  ],
})
export class CommonModule {}
