import { AppConfig } from './app.config.type';
import { QueueConfigType } from './queue.config.type';
import { ViewConfigType } from './view.config.type';
import { DatabaseConfig } from './database.config.type';
import { FileConfig } from './file-config.type';
import { MiddlewareConfigType } from './middleware.config.type';
import { RedisConfigType } from './redis.config.type';
import { MailConfigType } from './mail-config.type';
import { AuthConfigType } from './auth.config.type';
import { KafkaConfigType } from './kafka.config.type';

export type AllConfigType = {
  app: AppConfig;
  queue: QueueConfigType;
  view: ViewConfigType;
  database: DatabaseConfig;
  file: FileConfig;
  middleWare: MiddlewareConfigType;
  redis: RedisConfigType;
  mail: MailConfigType;
  auth: AuthConfigType;
  kafka: KafkaConfigType;
};
