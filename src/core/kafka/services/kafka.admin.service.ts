import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Admin, ITopicConfig, Kafka, KafkaConfig } from 'kafkajs';
import { Logger } from '@nestjs/common/services/logger.service';
import { ConfigService } from '@nestjs/config';
import { KafkaCreateTopics } from '../constants/kafka.enum';
import { IKafkaCreateTopic } from '../interfaces/kafka.interface';
import { IKafkaAdminService } from '../interfaces/kafka.admin-service.interface';

@Injectable()
export class KafkaAdminService
  implements IKafkaAdminService, OnModuleInit, OnModuleDestroy
{
  protected logger = new Logger(KafkaAdminService.name);
  private readonly kafka: Kafka;
  private readonly admin: Admin;
  private readonly topics: IKafkaCreateTopic[];
  private readonly brokers: string[];
  private readonly clientId: string;
  private readonly kafkaOptions: KafkaConfig;
  private readonly defaultPartition: number;

  constructor(private readonly configService: ConfigService) {
    this.clientId = <string>this.configService.getOrThrow<string>(
      'kafka.admin.clientId',
      {
        infer: true,
      }
    );

    this.brokers = this.configService
      .getOrThrow<string>('kafka.brokers', { infer: true })
      .split(',');

    this.topics = KafkaCreateTopics;

    this.kafkaOptions = {
      clientId: this.clientId,
      brokers: this.brokers,
    };

    if (
      this.configService.get('kafka.username') &&
      this.configService.get('kafka.password')
    ) {
      this.kafkaOptions = {
        ...this.kafkaOptions,
        ...{
          sasl: {
            mechanism: 'plain',
            username: <string>this.configService.get('kafka.username'),
            password: <string>this.configService.get('kafka.password'),
          },
          ssl: true,
        },
      };
    }

    this.defaultPartition = <number>(
      this.configService.get<number>('kafka.admin.defaultPartition')
    );

    this.logger.log(`Brokers ${this.brokers}`);
    this.kafka = new Kafka(this.kafkaOptions);

    this.admin = this.kafka.admin();
  }

  async onModuleInit(): Promise<void> {
    await this.connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.disconnect();
  }

  async connect(): Promise<void> {
    this.logger.log(`Connecting ${KafkaAdminService.name} Admin`);
    await this.admin.connect();
    this.logger.log(`${KafkaAdminService.name} Admin Connected`);
  }

  async disconnect(): Promise<void> {
    this.logger.log(`Disconnecting ${KafkaAdminService.name} Admin`);
    await this.admin.connect();
    this.logger.log(`${KafkaAdminService.name} Admin Disconnected`);
  }

  async getAllTopic(): Promise<string[]> {
    return this.admin.listTopics();
  }

  async getAllTopicUnique(): Promise<string[]> {
    return [...new Set(await this.getAllTopic())].filter(
      val => val !== '__consumer_offsets'
    );
  }

  async createTopics(): Promise<boolean> {
    this.logger.log(`Topics ${this.topics}`);

    const currentTopic: string[] = await this.getAllTopicUnique();
    const data: ITopicConfig[] = [];

    for (const topic of this.topics) {
      const partition: number = topic.partition ?? this.defaultPartition;
      const replicationFactor: number =
        topic.replicationFactor &&
        topic.replicationFactor <= this.brokers.length
          ? topic.replicationFactor
          : this.brokers.length;
      if (!currentTopic.includes(topic.topic)) {
        data.push({
          topic: topic.topic,
          numPartitions: partition,
          replicationFactor: replicationFactor,
        });
      }

      if (!currentTopic.includes(topic.topicReply)) {
        data.push({
          topic: topic.topicReply,
          numPartitions: partition,
          replicationFactor,
        });
      }
    }

    if (data.length > 0) {
      await this.admin.createTopics({
        waitForLeaders: true,
        topics: data,
      });
    }

    this.logger.log(`${KafkaAdminService.name} Topic Created`);

    return true;
  }

  async deleteTopics(): Promise<boolean> {
    const currentTopic: string[] = await this.getAllTopicUnique();

    const data = [];

    for (const topic of this.topics) {
      if (currentTopic.includes(topic.topic)) {
        data.push(topic.topic);
      }

      if (currentTopic.includes(topic.topicReply)) {
        data.push(topic.topicReply);
      }
    }

    if (data.length > 0) {
      await this.admin.deleteTopics({
        topics: data,
      });
    }

    this.logger.log(`${KafkaAdminService.name} Topic Deleted`);

    return true;
  }
}
