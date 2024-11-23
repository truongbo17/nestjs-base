import { StorageUploadInterface } from '../../../interfaces/storage-upload.interface';
import { Promise } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ENUM_STORAGE } from '../../../enums/file.enum';
import { UploadFileInterface } from '../../../interfaces/upload-file.interface';
import { Logger } from '@nestjs/common';
import { Readable } from 'stream';

export class S3Storage implements StorageUploadInterface {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private logger = new Logger(S3Storage.name);

  constructor(private readonly configService: ConfigService) {
    this.bucketName = configService.getOrThrow<string>(
      'file.awsDefaultS3Bucket',
      { infer: true }
    );

    this.s3Client = new S3Client({
      region: this.configService.get('file.awsS3Region', { infer: true }),
      credentials: {
        accessKeyId: this.configService.getOrThrow('file.accessKeyId', {
          infer: true,
        }),
        secretAccessKey: this.configService.getOrThrow('file.secretAccessKey', {
          infer: true,
        }),
      },
      endpoint: this.configService.get<string>('file.endpoint', {
        infer: true,
      }), // URL MinIO
      forcePathStyle: true,
    });
  }

  async deleteFile(filePath: string): Promise<boolean> {
    const bucketName = this.configService.get<string>('file.awsS3Bucket', {
      infer: true,
    });

    try {
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: bucketName,
          Key: filePath,
        })
      );

      return true;
    } catch (error) {
      this.logger.error(error);
    }

    return false;
  }

  async getUrl(filePath: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: filePath,
    });

    return getSignedUrl(this.s3Client, command, {
      expiresIn: this.configService.get<number>('file.expiresIn', {
        infer: true,
      }),
    });
  }

  async getFile(filePath: string): Promise<Readable> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: filePath,
    });

    const response = await this.s3Client.send(command);
    return response.Body as Readable;
  }

  async uploadFile(file: Express.Multer.File): Promise<UploadFileInterface> {
    const key = `${randomStringGenerator()}.${file.originalname
      .split('.')
      .pop()
      ?.toLowerCase()}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentLength: file.size,
      ContentType: file.mimetype,
    });
    await this.s3Client.send(command);

    return {
      path: key,
      url: await this.getUrl(key),
      storage: ENUM_STORAGE.S3,
    };
  }

  uploadFiles(files: Express.Multer.File[]): Promise<UploadFileInterface[]> {
    const uploadPromises = files.map(file => this.uploadFile(file));
    return Promise.all(uploadPromises);
  }
}
