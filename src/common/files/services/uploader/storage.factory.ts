import { StorageUploadInterface } from '../../interfaces/storage-upload.interface';
import { LocalStorage } from './storage/local.storage';
import { S3Storage } from './storage/s3.storage';
import { ENUM_STORAGE } from '../../enums/file.enum';

export class StorageFactory {
  static create(storageType: string): StorageUploadInterface {
    switch (storageType) {
      case ENUM_STORAGE.LOCAL:
        return new LocalStorage();
      case ENUM_STORAGE.S3:
        return new S3Storage();
      default:
        throw new Error(`Storage type "${storageType}" is not supported.`);
    }
  }
}
