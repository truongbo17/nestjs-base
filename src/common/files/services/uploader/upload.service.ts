import { Injectable } from '@nestjs/common';
import { StorageUploadInterface } from '../../interfaces/storage-upload.interface';
import { StorageFactory } from './storage.factory';
import { ENUM_STORAGE } from '../../enums/file.enum';
import { Readable } from 'stream';

@Injectable()
export class UploaderService {
  static storage(storage?: ENUM_STORAGE) {
    return this;
  }

  async upload(
    file: Express.Multer.File,
    storageType: string
  ): Promise<string> {
    const storage: StorageUploadInterface = StorageFactory.create(storageType);
    return storage.uploadFile(file);
  }

  async uploadMultiple(
    files: Express.Multer.File[],
    storageType: string
  ): Promise<string[]> {
    const storage: StorageUploadInterface = StorageFactory.create(storageType);
    return storage.uploadFiles(files);
  }

  async delete(filePath: string, storageType: string): Promise<void> {
    const storage: StorageUploadInterface = StorageFactory.create(storageType);
    await storage.deleteFile(filePath);
  }

  async getFile(filePath: string, storageType: string): Promise<Readable> {
    const storage: StorageUploadInterface = StorageFactory.create(storageType);
    return storage.getFile(filePath);
  }
}
