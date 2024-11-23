import { StorageUploadInterface } from '../../../interfaces/storage-upload.interface';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { ConfigService } from '@nestjs/config';
import { UploadFileInterface } from '../../../interfaces/upload-file.interface';
import { ENUM_STORAGE } from '../../../enums/file.enum';
import { Promise } from 'mongoose';
import { Logger } from '@nestjs/common';
import { Readable } from 'stream';

export class LocalStorage implements StorageUploadInterface {
  private readonly uploadPath: string;
  private logger = new Logger(LocalStorage.name);

  constructor(private readonly configService: ConfigService) {
    this.uploadPath = <string>(
      this.configService.getOrThrow('file.pathLocal', { infer: true })
    );
  }

  async uploadFile(file: Express.Multer.File): Promise<UploadFileInterface> {
    const filePath: string = path.join(this.uploadPath, file.originalname);

    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }

    fs.writeFileSync(filePath, file.buffer);
    return {
      path: filePath,
      url: await this.getUrl(filePath),
      storage: ENUM_STORAGE.LOCAL,
    };
  }

  async uploadFiles(
    files: Express.Multer.File[]
  ): Promise<UploadFileInterface[]> {
    const uploadPromises = files.map(file => this.uploadFile(file));
    return Promise.all(uploadPromises);
  }

  async deleteFile(filePath: string): Promise<boolean> {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return true;
      }
    } catch (error) {
      this.logger.error(error);
    }

    return false;
  }

  async getUrl(filePath: string): Promise<string> {
    return (
      <string>this.configService.get('app.appUrl', { infer: true }) +
      '/' +
      filePath
    );
  }

  async getFile(filePath: string): Promise<Readable> {
    if (!fs.existsSync(filePath)) {
      throw new Error('File not found');
    }

    return fs.createReadStream(filePath);
  }
}
