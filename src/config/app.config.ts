import { registerAs } from '@nestjs/config';
import { AppConfig } from './app.config.type';
import validateConfig from '../utils/validate-config';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
} from 'class-validator';

enum Environment {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  TESTING = 'testing',
}

const DEFAULT_APP_PORT: number = 3000;
const DEFAULT_BACKEND_DOMAIN: string = 'http://localhost';
const DEFAULT_API_PREFIX: string = 'api';
const DEFAULT_APP_FALLBACK_LANGUAGE: string = 'en';
const DEFAULT_APP_HEADER_LANGUAGE: string = 'x-custom-lang';

class EnvironmentVariablesValidator {
  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV!: Environment;

  @IsInt()
  @Min(0)
  @Max(65535)
  @IsOptional()
  APP_PORT!: number;

  @IsUrl({ require_tld: false })
  @IsOptional()
  FRONTEND_DOMAIN!: string;

  @IsUrl({ require_tld: false })
  @IsOptional()
  BACKEND_DOMAIN!: string;

  @IsString()
  @IsOptional()
  API_PREFIX!: string;

  @IsString()
  @IsOptional()
  APP_FALLBACK_LANGUAGE!: string;

  @IsString()
  @IsOptional()
  APP_HEADER_LANGUAGE!: string;
}

export default registerAs<AppConfig>('app', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    name: process.env.APP_NAME || 'app',
    workingDirectory: process.env.PWD || process.cwd(),
    frontendDomain: process.env.FRONTEND_DOMAIN,
    backendDomain: process.env.BACKEND_DOMAIN ?? DEFAULT_BACKEND_DOMAIN,
    port: process.env.APP_PORT
      ? parseInt(process.env.APP_PORT, 10)
      : DEFAULT_APP_PORT,
    apiPrefix: process.env.API_PREFIX || DEFAULT_API_PREFIX,
    fallbackLanguage:
      process.env.APP_FALLBACK_LANGUAGE || DEFAULT_APP_FALLBACK_LANGUAGE,
    headerLanguage:
      process.env.APP_HEADER_LANGUAGE || DEFAULT_APP_HEADER_LANGUAGE,
  };
});
