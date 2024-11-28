import { LegacyPartitioner } from 'kafkajs';

export type KafkaConfigType = {
  enable: boolean;
  clientId: string;
  brokers: string;
  username?: string;
  password?: string;
  mechanism: string;

  // consumer
  consumerEnable: boolean;
  consumer: {
    sessionTimeout: string | number;
    rebalanceTimeout: string | number;
    heartbeatInterval: string | number;

    maxBytesPerPartition: string | number;
    maxBytes: string | number;
    maxWaitTimeInMs: string | number;

    maxInFlightRequests: null | number;

    retry: {
      maxRetryTime: string | number;
      initialRetryTime: string | number;
      retries: number;
    };
  };
  consumerSubscribe: {
    fromBeginning: boolean;
  };

  // producer
  producer: {
    createPartitioner: LegacyPartitioner;
    transactionTimeout: string | number;

    retry: {
      maxRetryTime: string | number;
      initialRetryTime: string | number;
      retries: number;
    };
  };
  producerSend: {
    timeout: string | number;
  };

  // topic creation
  allowAutoTopicCreation: boolean;

  // admin
  admin: {
    clientId: string;
    defaultPartition: number;
  };
};
