import { Logger, Module } from '@nestjs/common';
import { GetCurrentVersionCommand } from './get-current-version.command';
import { ConsoleModule } from 'nestjs-console';
import { LoggerModule } from '../../common/logger/logger.module';
import { KafkaAdminModule } from '../../core/kafka/kafka.admin.module';
import { CreateTopicCommand } from './create-topic.command';
import { DeleteTopicCommand } from './delete-topic.command';

@Module({
  imports: [LoggerModule.forRoot(false), ConsoleModule, KafkaAdminModule],
  providers: [
    GetCurrentVersionCommand,
    Logger,
    CreateTopicCommand,
    DeleteTopicCommand,
  ],
})
export class AppCommandModule {}
