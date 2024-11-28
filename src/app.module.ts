import { Module } from '@nestjs/common';
import { RouterModule } from './routers/router.module';
import { AppMiddlewareModule } from './core/app/app.middleware.module';
import { WorkerModule } from './workers/worker.module';
import { CommonModule } from './common/common.module';
import { TypeOrmConfigService } from './common/database/typeorm-config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { KafkaCommonModule } from './core/kafka/kafka.common.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { join } from 'node:path';
import { AppResolver } from './common/resolvers/query.resolver';

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
    // Kafka
    KafkaCommonModule.forRoot(),
    // GraphQL
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'),
      },
      autoSchemaFile: true,
    }),
    // Modules append...
  ],
  controllers: [],
  providers: [AppResolver],
})
export class AppModule {}
