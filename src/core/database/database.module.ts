import { DynamicModule, Module } from '@nestjs/common';
import databaseConfig from '../../config/database.config';
import { DatabaseConfig } from '../../config/database.config.type';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './mongoose-config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './typeorm-config.service';
import { DataSource, DataSourceOptions } from 'typeorm';

@Module({})
export class DatabaseModule {
  static forRootAsync(): DynamicModule {
    const config: DatabaseConfig = databaseConfig() as DatabaseConfig;
    const databaseModule: DynamicModule = config.isDocumentDatabase
      ? MongooseModule.forRootAsync({
          useClass: MongooseConfigService,
        })
      : TypeOrmModule.forRootAsync({
          useClass: TypeOrmConfigService,
          dataSourceFactory: async (
            options: DataSourceOptions | undefined,
          ): Promise<DataSource> => {
            if (!options) {
              throw new Error('No Datasource options provided');
            }
            return await new DataSource(options).initialize();
          },
        });

    return {
      module: DatabaseModule,
      imports: [databaseModule],
    };
  }
}
