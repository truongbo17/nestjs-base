import { Command, Console } from 'nestjs-console';
import * as path from 'node:path';
import * as fs from 'node:fs';

@Console()
export class GetCurrentVersionCommand {
  private PACKAGE_NAME: string = '@nestjs/core';
  private PACKAGE_PATH: string = '../../../package.json';

  @Command({
    command: 'version',
    description: 'Get current version application',
  })
  async getCurrentVersion(): Promise<void> {
    const packageJson = JSON.parse(
      fs.readFileSync(path.join(__dirname, this.PACKAGE_PATH), 'utf8'),
    );

    console.log(
      `\u001b[37;42m NestJS version: ${packageJson.dependencies[this.PACKAGE_NAME]}`,
    );
  }
}
