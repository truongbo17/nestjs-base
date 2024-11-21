import { registerAs } from '@nestjs/config';
import { AppConfig } from './app.config.type';
import validateConfig from '../utils/validate-config';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
} from 'class-validator';
import * as process from 'node:process';
import { ENUM_MESSAGE_LANGUAGE } from '../core/i18n/enums/i18n.enum';
import { Type } from 'class-transformer';
import { version } from 'package.json';

export enum Environment {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  TESTING = 'testing',
}

export enum ENUM_APP_TIMEZONE {
  VN_HCM = 'Asia/Ho_Chi_Minh',
}

const DEFAULT_APP_PORT: number = 3000;
const DEFAULT_API_PREFIX: string = 'api';
const DEFAULT_APP_LANGUAGE: ENUM_MESSAGE_LANGUAGE = ENUM_MESSAGE_LANGUAGE.EN;
const DEFAULT_APP_HEADER_LANGUAGE: string = 'x-custom-lang';
const DEFAULT_APP_TIMEZONE: string = ENUM_APP_TIMEZONE.VN_HCM;

class EnvironmentVariablesValidator {
  @IsEnum(Environment)
  @IsOptional()
  APP_ENV!: Environment;

  @IsInt()
  @Min(0)
  @Max(65535)
  @IsOptional()
  APP_PORT!: number;

  @IsUrl({ require_tld: false })
  @IsOptional()
  APP_URL!: string;

  @IsString()
  @IsOptional()
  APP_NAME!: string;

  @IsString()
  @IsOptional()
  API_PREFIX!: string;

  @IsString()
  @IsOptional()
  @IsEnum(ENUM_MESSAGE_LANGUAGE)
  APP_LANGUAGE!: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(ENUM_APP_TIMEZONE)
  APP_TIMEZONE!: string;

  @IsBoolean()
  @IsNotEmpty()
  @Type(() => Boolean)
  URL_VERSIONING_ENABLE!: boolean;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  URL_VERSION!: number;
}

export default registerAs<AppConfig>('app', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    appEnv: process.env.APP_ENV || Environment.DEVELOPMENT,
    name: process.env.APP_NAME || 'NestJs',
    workingDirectory: process.env.PWD || process.cwd(),
    appUrl: process.env.APP_URL || 'http://localhost',
    port: process.env.APP_PORT
      ? parseInt(process.env.APP_PORT, 10)
      : DEFAULT_APP_PORT,
    apiPrefix: process.env.API_PREFIX || DEFAULT_API_PREFIX,
    appLanguage:
      <ENUM_MESSAGE_LANGUAGE>process.env.APP_LANGUAGE || DEFAULT_APP_LANGUAGE,
    availableLanguage: Object.values(ENUM_MESSAGE_LANGUAGE),
    headerLanguage: DEFAULT_APP_HEADER_LANGUAGE,
    timezone: process.env.APP_TIMEZONE || DEFAULT_APP_TIMEZONE,
    urlVersion: {
      enable: process.env.URL_VERSIONING_ENABLE === 'true',
      prefix: 'v',
      version: process.env.URL_VERSION ? parseInt(process.env.URL_VERSION) : 1,
    },
    repoVersion: version,
  };
});
