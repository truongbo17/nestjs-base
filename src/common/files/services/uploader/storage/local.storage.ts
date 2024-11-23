import { StorageUploadInterface } from '../../../interfaces/storage-upload.interface';
import { Readable } from 'stream';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { ConfigService } from '@nestjs/config';

export class LocalStorage implements StorageUploadInterface {
  private readonly uploadPath: string;

  constructor(private readonly configService: ConfigService) {
    this.uploadPath = <string>(
      this.configService.getOrThrow('file.pathLocal', { infer: true })
    );
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const filePath: string = path.join(this.uploadPath, file.originalname);

    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }

    fs.writeFileSync(filePath, file.buffer);
    return filePath;
  }

  async uploadFiles(files: Express.Multer.File[]): Promise<string[]> {
    const filePaths: string[] = [];
    for (const file of files) {
      filePaths.push(await this.uploadFile(file));
    }
    return filePaths;
  }

  async deleteFile(filePath: string): Promise<void> {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  async getFile(filePath: string): Promise<Readable> {
    if (!fs.existsSync(filePath)) {
      throw new Error('File not found');
    }

    return fs.createReadStream(filePath);
  }
}
