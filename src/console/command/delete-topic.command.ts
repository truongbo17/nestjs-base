import { Command, Console } from 'nestjs-console';
import { LoggerService } from '../../common/logger/services/logger.service';
import { KafkaAdminService } from '../../core/kafka/services/kafka.admin.service';

@Console()
export class DeleteTopicCommand {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly kafkaAdminService: KafkaAdminService
  ) {}

  @Command({
    command: 'remove:kafka-topics',
    description: 'Remove kafka topic',
  })
  async remove(): Promise<void> {
    this.loggerService.log('log', `Delete topic:`, DeleteTopicCommand.name);

    try {
      await this.kafkaAdminService.deleteTopics();
    } catch (err: any) {
      throw new Error(err.message);
    }

    return;
  }
}
