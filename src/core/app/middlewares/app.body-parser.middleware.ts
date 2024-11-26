import {
  Injectable,
  NestMiddleware,
  PayloadTooLargeException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { ConfigService } from '@nestjs/config';
import multer from 'multer';

@Injectable()
export class AppUrlencodedBodyParserMiddleware implements NestMiddleware {
  private readonly maxFile: number;

  constructor(private readonly configService: ConfigService) {
    this.maxFile = this.configService.getOrThrow<number>(
      'middleware.body.urlencoded.maxFileSize',
      { infer: true }
    );
  }

  use(req: Request, res: Response, next: NextFunction): void {
    bodyParser.urlencoded({
      extended: false,
      limit: this.maxFile,
    })(req, res, next);
  }
}

@Injectable()
export class AppJsonBodyParserMiddleware implements NestMiddleware {
  private readonly maxFile: number;

  constructor(private readonly configService: ConfigService) {
    this.maxFile = this.configService.get<number>(
      'middleware.body.json.maxFileSize',
      { infer: true }
    );
  }

  use(req: Request, res: Response, next: NextFunction): void {
    bodyParser.json({
      limit: this.maxFile,
    })(req, res, next);
  }
}

@Injectable()
export class AppRawBodyParserMiddleware implements NestMiddleware {
  private readonly maxFile: number;

  constructor(private readonly configService: ConfigService) {
    this.maxFile = this.configService.get<number>(
      'middleware.body.raw.maxFileSize',
      { infer: true }
    );
  }

  use(req: Request, res: Response, next: NextFunction): void {
    bodyParser.raw({
      limit: this.maxFile,
    })(req, res, next);
  }
}

@Injectable()
export class AppTextBodyParserMiddleware implements NestMiddleware {
  private readonly maxFile: number;

  constructor(private readonly configService: ConfigService) {
    this.maxFile = this.configService.get<number>(
      'middleware.body.text.maxFileSize',
      { infer: true }
    );
  }

  use(req: Request, res: Response, next: NextFunction): void {
    bodyParser.text({
      limit: this.maxFile,
    })(req, res, next);
  }
}

@Injectable()
export class FileUploadLimitMiddleware implements NestMiddleware {
  private readonly maxFileSize: number;

  constructor(private readonly configService: ConfigService) {
    this.maxFileSize = this.configService.get<number>('file.maxFileSize', {
      infer: true,
    });
  }

  use(req: Request, res: Response, next: NextFunction): void {
    const upload = multer({
      limits: { fileSize: this.maxFileSize },
    }).any();

    upload(req, res, err => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          throw new PayloadTooLargeException(
            'File size exceeds the maximum allowed limit'
          );
        }
        throw err;
      }
      next();
    });
  }
}
