import { Controller } from '@nestjs/common';
import { IKafkaResponse } from '../interfaces/kafka.interface';
import { KafkaDto } from '../dtos/kafka.dto';
import { ENUM_KAFKA_TOPICS } from '../constants/kafka.topic.constant';
import {
  MessageCommitOffsetInFirstRunning,
  MessageTopic,
  MessageValue,
} from '../decorators/kafka.decorator';

@Controller()
export class KafkaController {
  @MessageCommitOffsetInFirstRunning()
  @MessageTopic('nestjs.app.test')
  async helloKafka(
    @MessageValue() value: Record<string, any>
  ): Promise<IKafkaResponse> {
    return value;
  }
}
