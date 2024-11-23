import { Injectable } from '@nestjs/common';
import { StorageUploadInterface } from '../../interfaces/storage-upload.interface';
import { StorageFactory } from './storage.factory';
import { Readable } from 'stream';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploaderService {
  constructor(private readonly configService: ConfigService) {}

  async upload(
    file: Express.Multer.File,
    storageType: string
  ): Promise<string> {
    const storage: StorageUploadInterface = StorageFactory.create(
      storageType,
      this.configService
    );
    return storage.uploadFile(file);
  }

  async uploadMultiple(
    files: Express.Multer.File[],
    storageType: string
  ): Promise<string[]> {
    const storage: StorageUploadInterface = StorageFactory.create(
      storageType,
      this.configService
    );
    return storage.uploadFiles(files);
  }

  async delete(filePath: string, storageType: string): Promise<void> {
    const storage: StorageUploadInterface = StorageFactory.create(
      storageType,
      this.configService
    );
    await storage.deleteFile(filePath);
  }

  async getFile(filePath: string, storageType: string): Promise<Readable> {
    const storage: StorageUploadInterface = StorageFactory.create(
      storageType,
      this.configService
    );
    return storage.getFile(filePath);
  }
}
