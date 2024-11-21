import { registerAs } from '@nestjs/config';
import { AppConfig } from './app.config.type';
import validateConfig from '../utils/validate-config';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
} from 'class-validator';
import * as process from 'node:process';
import { ENUM_MESSAGE_LANGUAGE } from '../core/i18n/enums/i18n.enum';

export enum Environment {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  TESTING = 'testing',
}

const DEFAULT_APP_PORT: number = 3000;
const DEFAULT_API_PREFIX: string = 'api';
const DEFAULT_APP_LANGUAGE: string = 'en';
const DEFAULT_APP_HEADER_LANGUAGE: string = 'x-custom-lang';
const DEFAULT_APP_TIMEZONE: string = 'Asia/Ho_Chi_Minh';

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
  APP_LANGUAGE!: string;

  @IsString()
  @IsNotEmpty()
  APP_TIMEZONE!: string;
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
    appLanguage: process.env.APP_LANGUAGE || DEFAULT_APP_LANGUAGE,
    availableLanguage: Object.values(ENUM_MESSAGE_LANGUAGE),
    headerLanguage: DEFAULT_APP_HEADER_LANGUAGE,
    timezone: process.env.APP_TIMEZONE || DEFAULT_APP_TIMEZONE,
  };
});
