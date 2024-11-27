import { Module } from '@nestjs/common';
import { FileRepository } from './repositories/file.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from './entities/file.entity';

@Module({
  controllers: [],
  providers: [FileRepository],
  exports: [FileRepository],
  imports: [TypeOrmModule.forFeature([FileEntity])],
})
export class FileRepositoryModule {}
