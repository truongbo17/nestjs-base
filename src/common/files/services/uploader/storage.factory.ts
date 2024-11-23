import { StorageUploadInterface } from '../../interfaces/storage-upload.interface';
import { LocalStorage } from './storage/local.storage';
import { S3Storage } from './storage/s3.storage';
import { ENUM_STORAGE } from '../../enums/file.enum';
import { ConfigService } from '@nestjs/config';

export class StorageFactory {
  static create(
    storageType: string,
    configService: ConfigService
  ): StorageUploadInterface {
    switch (storageType) {
      case ENUM_STORAGE.LOCAL:
        return new LocalStorage(configService);
      case ENUM_STORAGE.S3:
        return new S3Storage(configService);
      default:
        throw new Error(`Storage type "${storageType}" is not supported.`);
    }
  }
}
