import { Injectable } from '@nestjs/common';
import { Cron, Timeout } from '@nestjs/schedule';
import { execSync } from 'child_process';
import helpers from '../../utils/helpers';

@Injectable()
export class GetCurrentVersionSchedule {
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

    helpers.log('log', 'Start after 3 seconds', GetCurrentVersionSchedule.name);
  }

  getCurrentVersion(): void {
    execSync('npm run console:dev version', { stdio: 'inherit' });
  }
}
