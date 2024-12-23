import { ClientsModule, Transport } from '@nestjs/microservices';
import { Global, Module } from '@nestjs/common';
import { KafkaService } from './services/kafka.service';
import { KAFKA_SERVICE_NAME } from './constants/kafka.enum';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProducerConfig } from 'kafkajs';

@Global()
@Module({
  providers: [KafkaService],
  exports: [KafkaService],
  imports: [
    ClientsModule.registerAsync([
      {
        name: KAFKA_SERVICE_NAME,
        inject: [ConfigService],
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: configService.get<string>('kafka.clientId'),
              brokers: configService
                .getOrThrow<string>('kafka.brokers', { infer: true })
                .split(','),
            },
            producer: {
              ...configService.get<ProducerConfig>('kafka.producer'),
              allowAutoTopicCreation: configService.get<boolean>(
                'kafka.allowAutoTopicCreation'
              ),
            },
          },
        }),
      },
    ]),
  ],
})
export class KafkaModule {}
