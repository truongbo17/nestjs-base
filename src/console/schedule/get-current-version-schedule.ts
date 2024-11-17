import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CommandService } from 'nestjs-command';

@Injectable()
export class GetCurrentVersionSchedule {
  private readonly logger = new Logger(GetCurrentVersionSchedule.name);

  constructor(private readonly commandService: CommandService) {}

  @Cron('*/5 * * * * *', {
    name: 'GetCurrentVersionSchedule',
  })
  handleGetCurrentVersion() {
    this.commandService.exec(['version']);

    this.logger.debug('Called when the current second is 3');
  }
}
