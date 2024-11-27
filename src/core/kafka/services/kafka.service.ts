import { Injectable, OnModuleInit } from '@nestjs/common';
import { Consumer, EachMessagePayload, Kafka } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleInit {
  private readonly kafka = new Kafka({
    brokers: ['35.221.212.240:9092'], // Địa chỉ Kafka broker
  });

  private readonly consumer: Consumer = this.kafka.consumer({
    groupId: 'test',
  });

  async onModuleInit() {
    await this.consumer.connect();
    await this.consumer.subscribe({
      topic: 'sdk-transactions',
      fromBeginning: true,
    });

    await this.consumer.run({
      eachMessage: async (payload: EachMessagePayload) => {
        const { topic, partition, message } = payload;
        console.log(`Received message: ${message.value} from topic: ${topic}`);
      },
    });
  }
}
