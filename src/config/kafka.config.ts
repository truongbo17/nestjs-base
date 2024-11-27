import { registerAs } from '@nestjs/config';
import validateConfig from '../utils/validate-config';
import { KafkaConfigType } from './kafka.config.type';
import ms from 'ms';
import bytes from 'bytes';
import { Partitioners } from 'kafkajs';
import * as process from 'node:process';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

const DEFAULT_BROKERS: string = 'localhost:9092';

class EnvironmentVariablesValidator {
  @IsString()
  @IsOptional()
  KAFKA_CLIENT_ID?: string;

  @IsString()
  @IsOptional()
  KAFKA_BROKERS?: string;

  @IsBoolean()
  @IsOptional()
  KAFKA_CONSUMER_ENABLE?: boolean;

  @IsString()
  @IsOptional()
  KAFKA_ADMIN_CLIENT_ID?: string;

  @IsString()
  @IsOptional()
  KAFKA_USERNAME?: string;

  @IsString()
  @IsOptional()
  KAFKA_PASSWORD?: string;
}

export default registerAs<KafkaConfigType>('kafka', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    clientId: <string>process.env.KAFKA_CLIENT_ID || 'KAFKA_CLIENT',
    brokers: process.env.KAFKA_BROKERS ?? DEFAULT_BROKERS,

    username: process.env.SASL_KAFKA_USERNAME,
    password: process.env.SASL_KAFKA_PASSWORD,
    mechanism: 'plain',

    // consumer
    consumerEnable: process.env.KAFKA_CONSUMER_ENABLE === 'true',
    consumer: {
      sessionTimeout: ms('60s'), // 6000 .. 300000
      rebalanceTimeout: ms('90s'), // 300000
      heartbeatInterval: ms('3s'), // 3000

      maxBytesPerPartition: bytes('1mb'), // 1mb
      maxBytes: bytes('10mb'), // 5mb
      maxWaitTimeInMs: ms('5s'), // 5s

      maxInFlightRequests: null, // set this to make customer guaranteed sequential

      retry: {
        maxRetryTime: ms('60s'), // 30s
        initialRetryTime: ms('0.3s'), // 3s
        retries: 5,
      },
    },
    consumerSubscribe: {
      fromBeginning: false,
    },

    // producer
    producer: {
      createPartitioner: Partitioners.LegacyPartitioner,
      transactionTimeout: ms('100s'), // 30000 .. 60000

      retry: {
        maxRetryTime: ms('60s'), // 30s
        initialRetryTime: ms('0.3s'), // 3s
        retries: 5,
      },
    },
    producerSend: {
      timeout: ms('30s'), // 30s
    },

    // topic creation
    allowAutoTopicCreation: false,

    // admin
    admin: {
      clientId: process.env.KAFKA_ADMIN_CLIENT_ID || 'KAFKA_ADMIN_CLIENT',
      defaultPartition: 3,
    },
  };
});
