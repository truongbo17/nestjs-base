import { Module } from '@nestjs/common';
import { FileService } from './services/file.service';
import { FileRepositoryModule } from './repository/file.repository.module';

@Module({
  controllers: [],
  providers: [FileService],
  exports: [FileService],
  imports: [FileRepositoryModule],
})
export class FileModule {}
