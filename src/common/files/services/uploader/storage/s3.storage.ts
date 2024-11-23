import { StorageUploadInterface } from '../../../interfaces/storage-upload.interface';
import { Promise } from 'mongoose';
import { Readable } from 'stream';
import { ConfigService } from '@nestjs/config';

export class S3Storage implements StorageUploadInterface {
  constructor(private readonly configService: ConfigService) {}

  deleteFile(filePath: string): Promise<void> {
    return Promise.resolve(undefined);
  }

  getFile(filePath: string): Promise<Readable> {
    return Promise.resolve(undefined);
  }

  uploadFile(file: Express.Multer.File): Promise<string> {
    return Promise.resolve('');
  }

  uploadFiles(files: Express.Multer.File[]): Promise<string[]> {
    return Promise.resolve([]);
  }
}
