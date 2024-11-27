import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileEntity } from '../entities/file.entity';
import { EntityRelational } from '../../../../common/database/relation/entities/relational-entity-helper';

@Injectable()
export class FileRepository {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileEntityRepository: Repository<FileEntity>
  ) {}

  async create(data: EntityRelational): Promise<FileEntity> {
    return await this.fileEntityRepository.save(
      this.fileEntityRepository.create(data)
    );
  }
}
