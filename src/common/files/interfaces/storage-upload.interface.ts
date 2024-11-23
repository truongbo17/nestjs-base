export interface StorageUploadInterface {
  uploadFile(file: Express.Multer.File): Promise<any>;

  uploadFiles(files: Express.Multer.File[]): Promise<string[]>;

  deleteFile(filePath: string): Promise<void>;

  getFile(filePath: string): Promise<string>;
}
