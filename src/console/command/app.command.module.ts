import { Module } from '@nestjs/common';
import { GetCurrentVersionCommand } from './get-current-version.command';
import { ConsoleModule } from 'nestjs-console';

@Module({
  imports: [ConsoleModule],
  providers: [GetCurrentVersionCommand],
})
export class AppCommandModule {}
