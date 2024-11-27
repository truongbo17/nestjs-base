import { Injectable } from '@nestjs/common';
import { FileRepository } from '../repository/repositories/file.repository';
import { FileCreateRequestDto } from '../dtos/requests/file.create.request.dto';
import { FileEntity } from '../repository/entities/file.entity';

@Injectable()
export class FileService {
  constructor(private readonly fileRepository: FileRepository) {}

  async create({ storage, path }: FileCreateRequestDto) {
    const file = new FileEntity();
    file.storage = storage;
    file.path = path;

    return this.fileRepository.create(file);
  }
}
