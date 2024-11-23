import { UploadFileInterface } from './upload-file.interface';
import { Readable } from 'stream';

export interface StorageUploadInterface {
  uploadFile(file: Express.Multer.File): Promise<UploadFileInterface>;

  uploadFiles(files: Express.Multer.File[]): Promise<UploadFileInterface[]>;

  deleteFile(filePath: string): Promise<boolean>;

  getUrl(filePath: string): Promise<string>;

  getFile(filePath: string): Promise<Readable>;
}
