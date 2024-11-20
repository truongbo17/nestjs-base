import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AllConfigType } from '../../config/config.type';
import * as path from 'node:path';
import { HeaderResolver, I18nModule } from 'nestjs-i18n';
import { I18nLangService } from './services/i18n-lang.service';

@Global()
@Module({})
export class I18nLangModule {
  static forRootAsync(): DynamicModule {
    return {
      module: I18nLangModule,
      imports: [
        I18nModule.forRootAsync({
          useFactory: (configService: ConfigService<AllConfigType>) => ({
            fallbackLanguage: configService.getOrThrow('app.fallbackLanguage', {
              infer: true,
            }),
            loaderOptions: {
              path: path.join(__dirname, '../../lang/'),
              watch: true,
            },
          }),
          resolvers: [
            {
              use: HeaderResolver,
              useFactory: (
                configService: ConfigService<AllConfigType>,
              ): [string] => {
                return [
                  configService.getOrThrow('app.headerLanguage', {
                    infer: true,
                  }),
                ];
              },
              inject: [ConfigService],
            },
          ],
          imports: [ConfigModule],
          inject: [ConfigService],
        }),
      ],
      providers: [I18nLangService],
      exports: [I18nLangService],
    };
  }
}
