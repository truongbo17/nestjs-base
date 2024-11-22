import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import cors, { CorsOptions } from 'cors';
import { ConfigService } from '@nestjs/config';
import arrayHelper from '../../../utils/array.helper';

@Injectable()
export class AppCorsMiddleware implements NestMiddleware {
  private readonly allowOrigin: string | boolean | string[];
  private readonly allowMethod: string[];
  private readonly allowHeader: string[];

  constructor(private readonly configService: ConfigService) {
    this.allowOrigin = this.configService.getOrThrow<
      string | boolean | string[]
    >('middleware.cors.allowOrigin', { infer: true });
    this.allowMethod = arrayHelper.parseStringToArray(
      this.configService.getOrThrow<string[]>('middleware.cors.allowMethod', {
        infer: true,
      })
    );
    this.allowHeader = arrayHelper.parseStringToArray(
      this.configService.getOrThrow<string[]>('middleware.cors.allowHeader', {
        infer: true,
      })
    );
  }

  use(req: Request, res: Response, next: NextFunction): void {
    const corsOptions: CorsOptions = {
      origin: this.allowOrigin,
      methods: this.allowMethod,
      allowedHeaders: this.allowHeader,
      preflightContinue: false,
      credentials: true,
      optionsSuccessStatus: HttpStatus.NO_CONTENT,
    };

    cors(corsOptions)(req, res, next);
  }
}
