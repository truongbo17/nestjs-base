import { Module } from '@nestjs/common';
import { FileRepository } from './repositories/file.repository';

@Module({
  controllers: [],
  providers: [FileRepository],
  exports: [FileRepository],
  imports: [],
})
export class FileRepositoryModule {}
