import { Injectable } from '@nestjs/common';
import { Cron, Timeout } from '@nestjs/schedule';
import { execSync } from 'child_process';
import { LoggerService } from '../../core/logger/services/logger.service';

@Injectable()
export class GetCurrentVersionSchedule {
  constructor(private readonly loggerService: LoggerService) {}

  @Cron('*/5 * * * * *', {
    name: 'GetCurrentVersionSchedule',
    disabled: true,
  })
  handleGetCurrentVersion() {
    this.getCurrentVersion();
  }

  @Timeout(3000)
  runGetCurrentVersion() {
    this.getCurrentVersion();

    this.loggerService.log(
      'log',
      'Start after 3 seconds',
      GetCurrentVersionSchedule.name
    );
  }

  getCurrentVersion(): void {
    execSync('npm run console:dev version', { stdio: 'inherit' });
  }
}
