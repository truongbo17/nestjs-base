import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AllConfigType } from '../../config/config.type';
import * as path from 'node:path';
import { HeaderResolver, I18nModule } from 'nestjs-i18n';
import { I18nLangService } from './services/i18n-lang.service';
import { ENUM_MESSAGE_LANGUAGE } from './enums/i18n.enum';

@Global()
@Module({})
export class I18nLangModule {
  static forRootAsync(): DynamicModule {
    return {
      module: I18nLangModule,
      imports: [
        I18nModule.forRootAsync({
          useFactory: (configService: ConfigService<AllConfigType>) => ({
            fallbackLanguage: configService
              .getOrThrow('app.availableLanguage', {
                infer: true,
              })
              .join(','),
            fallbacks: Object.values(ENUM_MESSAGE_LANGUAGE).reduce(
              (a, v) => ({ ...a, [`${v}-*`]: v }),
              {}
            ),
            loaderOptions: {
              path: path.join(process.env.PWD || process.cwd(), 'src/lang/'),
              watch: true,
            },
          }),
          resolvers: [
            {
              use: HeaderResolver,
              useFactory: (
                configService: ConfigService<AllConfigType>
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
