import { Command, Console } from 'nestjs-console';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { LoggerService } from '../../common/logger/services/logger.service';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
@Console()
export class GetCurrentVersionCommand {
  private PACKAGE_NAME: string = '@nestjs/core';
  private PACKAGE_PATH: string = '../../../package.json';

  constructor(
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService
  ) {}

  @Command({
    command: 'version',
    description: 'Get current version application',
  })
  async getCurrentVersion(): Promise<void> {
    const packageJson = JSON.parse(
      fs.readFileSync(path.join(__dirname, this.PACKAGE_PATH), 'utf8')
    );

    this.loggerService.log(
      'log',
      `NestJS current version: ${packageJson.dependencies[this.PACKAGE_NAME]}, app env: ${this.configService.get('app.appEnv')}`,
      GetCurrentVersionCommand.name
    );
  }
}
