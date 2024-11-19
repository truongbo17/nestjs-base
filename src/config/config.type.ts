import { AppConfig } from './app.config.type';
import { QueueConfigType } from './queue.config.type';
import { ViewConfigType } from './view.config.type';
import { DatabaseConfig } from './database.config.type';
import { FileConfig } from './file-config.type';

export type AllConfigType = {
  app: AppConfig;
  queue: QueueConfigType;
  view: ViewConfigType;
  database: DatabaseConfig;
  file: FileConfig;
};
