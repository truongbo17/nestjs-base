import { AppConfig } from './app.config.type';
import { QueueConfigType } from './queue.config.type';

export type AllConfigType = {
  app: AppConfig;
  queue: QueueConfigType;
};
