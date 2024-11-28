import { DynamicModule, Module } from '@nestjs/common';
import { KafkaModule } from './kafka.module';
import { KafkaRouterModule } from './kafka.router.module';
import process from 'node:process';

@Module({})
export class KafkaCommonModule {
  static forRoot(): DynamicModule {
    const imports = [];
    if (
      process.env.KAFKA_ENABLE === 'true' &&
      process.env.KAFKA_CONSUMER_ENABLE === 'true'
    ) {
      imports.push(KafkaRouterModule);
    }
    if (process.env.KAFKA_ENABLE === 'true') {
      imports.push(KafkaModule);
    }

    return {
      module: KafkaCommonModule,
      providers: [],
      exports: [],
      controllers: [],
      imports: imports,
    };
  }
}
