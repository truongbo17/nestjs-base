import { Module } from '@nestjs/common';
import { RouterModule } from './routers/router.module';
import { AppMiddlewareModule } from './core/app/app.middleware.module';
import { WorkerModule } from './workers/worker.module';
import { CommonModule } from './common/common.module';
import { TypeOrmConfigService } from './common/database/typeorm-config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { KafkaModule } from './core/kafka/kafka.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options: DataSourceOptions) => {
        return new DataSource(options).initialize();
      },
    }),
    //Middleware
    AppMiddlewareModule,
    // Common
    CommonModule,
    // Router
    RouterModule,
    // Workers
    WorkerModule,
    //Kafka
    KafkaModule,
    // Modules append...
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
