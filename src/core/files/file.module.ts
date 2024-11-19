import { Module } from '@nestjs/common';
import databaseConfig from '../../config/database.config';
import { DatabaseConfig } from '../../config/database.config.type';

const infrastructurePersistenceModule = (databaseConfig() as DatabaseConfig)
  .isDocumentDatabase
  ? ''
  : '';

@Module({
  imports: [],
  providers: [],
  exports: [],
})
export class FileModule {}
