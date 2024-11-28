import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  KafkaContext,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { ENUM_KAFKA_TOPICS } from '../constants/kafka.topic.constant';

@Controller()
export class KafkaController {
  private readonly logger = new Logger(KafkaController.name);

  constructor(private readonly configService: ConfigService) {}

  // @MessageCommitOffsetInFirstRunning()
  // @MessageTopic('nestjs.app.test')
  // async helloKafka(
  //   @MessageValue() value: Record<string, any>
  // ): Promise<IKafkaResponse> {
  //   return value;
  // }

  @MessagePattern(ENUM_KAFKA_TOPICS.NEST_APP_TEST)
  handleMessage(@Payload() message: any, @Ctx() context: KafkaContext) {
    const headers = context.getMessage().headers;
    this.logger.log(`Received message: ${message}`);
    this.logger.log(`Headers: ${headers}`);

    this.logger.log('app env: ' + this.configService.get('app.appEnv'));

    return `Message processed: ${message.value}`;
  }
}
