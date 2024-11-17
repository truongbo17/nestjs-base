import { Module } from '@nestjs/common';
import { GetCurrentVersionSchedule } from './get-current-version-schedule';

@Module({
  providers: [GetCurrentVersionSchedule],
})
export class ScheduleModule {}
