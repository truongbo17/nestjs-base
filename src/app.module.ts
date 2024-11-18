import { Module } from '@nestjs/common';
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
    // Modules append
    UsersModule,
  ],
  controllers: [],
  providers: [CommandService],
})
export class AppModule {}
