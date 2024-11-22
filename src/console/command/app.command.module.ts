import { Logger, Module } from '@nestjs/common';
import { GetCurrentVersionCommand } from './get-current-version.command';
import { ConsoleModule } from 'nestjs-console';
import { LoggerModule } from '../../common/logger/logger.module';

@Module({
  imports: [LoggerModule.forRoot(false), ConsoleModule],
  providers: [GetCurrentVersionCommand, Logger],
})
export class AppCommandModule {}
