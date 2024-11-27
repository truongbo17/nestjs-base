import { Command, Console } from 'nestjs-console';
import { LoggerService } from '../../common/logger/services/logger.service';
import { KafkaAdminService } from '../../core/kafka/services/kafka.admin.service';

@Console()
export class CreateTopicCommand {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly kafkaAdminService: KafkaAdminService
  ) {}

  @Command({
    command: 'insert:kafka-topics',
    description: 'Create kafka topic',
  })
  async insert(): Promise<void> {
    this.loggerService.log('log', `Create topic:`, CreateTopicCommand.name);

    try {
      await this.kafkaAdminService.createTopics();
    } catch (err: any) {
      throw new Error(err.message);
    }

    return;
  }
}
