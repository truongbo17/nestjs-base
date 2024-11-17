import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from './config/app.config';
import { HeaderResolver, I18nModule } from 'nestjs-i18n';
import { AllConfigType } from './config/config.type';
import { UsersModule } from './modules/users/users.module';
import * as path from 'node:path';
import { CommandModule } from 'nestjs-command';
import { AppCommandModule } from './console/command/app.command.module';

@Module({
  imports: [
    // Modules system
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      envFilePath: ['.env'],
    }),
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
    CommandModule,
    AppCommandModule,
    // Modules append
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
