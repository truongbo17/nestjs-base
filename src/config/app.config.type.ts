import { ENUM_MESSAGE_LANGUAGE } from '../core/i18n/enums/i18n.enum';

export type AppConfig = {
  appEnv: string;
  name: string;
  workingDirectory: string;
  appUrl?: string;
  port: number;
  apiPrefix: string;
  appLanguage: string;
  availableLanguage: ENUM_MESSAGE_LANGUAGE[];
  headerLanguage: string;
  timezone: string;
};
