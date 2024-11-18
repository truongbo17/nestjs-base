import { Logger, Module } from '@nestjs/common';
import { GetCurrentVersionSchedule } from './get-current-version-schedule';
import { CommandModule } from 'nestjs-command';

@Module({
  imports: [CommandModule],
  providers: [GetCurrentVersionSchedule, Logger],
})
export class ScheduleModule {}
