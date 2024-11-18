import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

@Processor('scan-dir.queue')
export class ScanDirQueue extends WorkerHost {
  private readonly logger: Logger = new Logger(ScanDirQueue.name);

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.debug('Start scan...');
    this.logger.debug(job.data);
    this.logger.debug('Scan completed');
  }
}
