import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestApplication } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConsumerConfig, ConsumerSubscribeTopics } from 'kafkajs';
import { ENUM_KAFKA_TOPICS } from './core/kafka/constants/kafka.topic.constant';

export default async function (app: NestApplication) {
  const configService = app.get(ConfigService);
  const logger = new Logger(NestApplication.name);

  const enable: boolean = <boolean>(
    configService.get<boolean>('kafka.consumerEnable')
  );
  const brokers: string[] = configService
    .getOrThrow<string>('kafka.brokers', { infer: true })
    .split(',');
  const clientId: string = configService.getOrThrow<string>('kafka.clientId');
  const consumerGroup: string = 'test';

  const consumer: ConsumerConfig =
    configService.getOrThrow<ConsumerConfig>('kafka.consumer');
  const allowAutoTopicCreation: boolean = configService.getOrThrow<boolean>(
    'kafka.allowAutoTopicCreation'
  );
  const subscribe: ConsumerSubscribeTopics = {
    topics: Object.values(ENUM_KAFKA_TOPICS),
    ...configService.get<ConsumerSubscribeTopics>('kafka.consumerSubscribe'),
  };

  if (enable) {
    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId,
          brokers,
        },
        subscribe,
        consumer: {
          ...consumer,
          allowAutoTopicCreation,
        },
      },
    });

    await app.startAllMicroservices();

    logger.log(
      `Kafka server ${clientId} connected on brokers ${brokers.join(', ')}`,
      NestApplication.name
    );
    logger.log(`Kafka consume group ${consumerGroup}`, NestApplication.name);

    logger.log(`==========================================================`);
  }
}
