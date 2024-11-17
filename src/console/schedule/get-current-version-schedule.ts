import { Injectable, Logger } from '@nestjs/common';
import { Cron, Timeout } from '@nestjs/schedule';
import { execSync } from 'child_process';

@Injectable()
export class GetCurrentVersionSchedule {
  private readonly logger: Logger = new Logger(GetCurrentVersionSchedule.name);

  constructor() {}

  @Cron('*/5 * * * * *', {
    name: 'GetCurrentVersionSchedule',
    disabled: true,
  })
  handleGetCurrentVersion() {
    this.getCurrentVersion();
    this.logger.debug('Every run in 5 seconds');
  }

  @Timeout(3000)
  runGetCurrentVersion() {
    this.getCurrentVersion();
    this.logger.debug('Start after 3 seconds');
  }

  getCurrentVersion(): void {
    execSync('npm run console:dev version', { stdio: 'inherit' });
  }
}
