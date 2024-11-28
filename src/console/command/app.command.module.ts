import { Logger, Module } from '@nestjs/common';
import { GetCurrentVersionCommand } from './get-current-version.command';
import { ConsoleModule } from 'nestjs-console';
import { LoggerModule } from '../../common/logger/logger.module';
import { ConfigModule } from '@nestjs/config';
import appConfig from '../../config/app.config';
import kafkaConfig from '../../config/kafka.config';
import { DeleteTopicCommand } from './delete-topic.command';
import { CreateTopicCommand } from './create-topic.command';
import { KafkaAdminModule } from '../../core/kafka/kafka.admin.module';

@Module({
  imports: [
    LoggerModule.forRoot(false),
    ConsoleModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, kafkaConfig],
    }),
    KafkaAdminModule,
  ],
  providers: [
    GetCurrentVersionCommand,
    Logger,
    CreateTopicCommand,
    DeleteTopicCommand,
  ],
})
export class AppCommandModule {}
