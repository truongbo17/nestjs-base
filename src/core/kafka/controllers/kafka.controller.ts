import { Controller, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ENUM_KAFKA_TOPICS } from '../constants/kafka.topic.constant';
import {
  MessageCommitOffsetInFirstRunning,
  MessageTopic,
  MessageValue,
} from '../decorators/kafka.decorator';
import { IKafkaResponse } from '../interfaces/kafka.interface';

@Controller()
export class KafkaController {
  private readonly logger = new Logger(KafkaController.name);

  constructor(private readonly configService: ConfigService) {}

  @MessageCommitOffsetInFirstRunning()
  @MessageTopic(ENUM_KAFKA_TOPICS.NEST_APP_TEST)
  async nestAppTestHandle(
    @MessageValue() value: Record<string, any>
  ): Promise<IKafkaResponse> {
    this.logger.log(value);
    return value;
  }
}
