import { Readable } from 'stream';

export interface StorageUploadInterface {
  uploadFile(file: Express.Multer.File): Promise<string>;

  uploadFiles(files: Express.Multer.File[]): Promise<string[]>;

  deleteFile(filePath: string): Promise<void>;

  getFile(filePath: string): Promise<Readable>;
}
