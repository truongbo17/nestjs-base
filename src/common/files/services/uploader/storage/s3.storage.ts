import { StorageUploadInterface } from '../../../interfaces/storage-upload.interface';
import { Promise } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export class S3Storage implements StorageUploadInterface {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

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

  deleteFile(filePath: string): Promise<void> {
    return Promise.resolve(undefined);
  }

  getFile(filePath: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: filePath,
    });

    return getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
  }

  async uploadFile(file: Express.Multer.File): Promise<any> {
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
    const response = await this.s3Client.send(command);
    console.log(response);

    return await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
  }

  uploadFiles(files: Express.Multer.File[]): Promise<string[]> {
    return Promise.resolve([]);
  }
}
