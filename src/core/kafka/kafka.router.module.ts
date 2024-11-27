import { Module } from '@nestjs/common';
import { KafkaController } from './controllers/kafka.controller';

@Module({
  providers: [],
  exports: [],
  imports: [],
  controllers: [KafkaController],
})
export class KafkaRouterModule {}
