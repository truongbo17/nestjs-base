import { Module } from '@nestjs/common';
import { GetCurrentVersion } from './get-current-version';
import { ConsoleModule } from 'nestjs-console';

@Module({
  imports: [ConsoleModule],
  providers: [GetCurrentVersion],
})
export class AppCommandModule {}
