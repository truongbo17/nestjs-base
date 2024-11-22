import { ENUM_MESSAGE_LANGUAGE } from '../common/i18n/enums/i18n.enum';
import { ENUM_CACHE_STORE, Environment } from './app.config';

export type AppConfig = {
  appEnv: Environment;
  debug: boolean;
  name: string;
  workingDirectory: string;
  appUrl?: string;
  port: number;
  apiPrefix: string;
  appLanguage: ENUM_MESSAGE_LANGUAGE;
  availableLanguage: ENUM_MESSAGE_LANGUAGE[];
  headerLanguage?: string;
  timezone: string;
  urlVersion: {
    enable?: boolean;
    prefix?: string;
    version?: number;
  };
  repoVersion: string;
  cacheStore: ENUM_CACHE_STORE;
};
