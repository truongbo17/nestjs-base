import { Logger, Module } from '@nestjs/common';
import { GetCurrentVersionCommand } from './get-current-version.command';
import { ConsoleModule } from 'nestjs-console';
import { LoggerModule } from '../../common/logger/logger.module';
import { KafkaAdminService } from '../../core/kafka/services/kafka.admin.service';

@Module({
  imports: [LoggerModule.forRoot(false), ConsoleModule, KafkaAdminService],
  providers: [GetCurrentVersionCommand, Logger],
})
export class AppCommandModule {}
