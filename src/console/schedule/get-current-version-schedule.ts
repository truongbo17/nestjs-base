import { Injectable } from '@nestjs/common';
import { Cron, Timeout } from '@nestjs/schedule';
import { execSync } from 'child_process';
import { LoggerService } from '../../common/logger/services/logger.service';
import { ConfigService } from '@nestjs/config';
import { Environment } from '../../config/app.config';

@Injectable()
export class GetCurrentVersionSchedule {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService
  ) {}

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
    const isProd: boolean =
      this.configService.get('app.appEnv') === Environment.PRODUCTION;

    execSync(`npm run ${isProd ? 'console' : 'console:dev'} version`, {
      stdio: 'inherit',
    });
  }
}
