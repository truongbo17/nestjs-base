import { IKafkaCreateTopic } from '../interfaces/kafka.interface';
import { ENUM_KAFKA_TOPICS } from './kafka.topic.constant';

export const KAFKA_SERVICE_NAME = 'KAFKA_SERVICE';
export const KafkaCreateTopics: IKafkaCreateTopic[] = Object.values(
  ENUM_KAFKA_TOPICS
).map(val => ({
  topic: val,
  topicReply: `${val}.reply`,
  // partition?: number;
  // replicationFactor?: number;
}));
