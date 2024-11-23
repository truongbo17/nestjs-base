import { Global, Module } from '@nestjs/common';
import { UploaderService } from './services/uploader/upload.service';

@Global()
@Module({
  imports: [],
  providers: [UploaderService],
  exports: [UploaderService],
})
export class FileModule {}
