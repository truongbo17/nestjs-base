import { HttpStatus, Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger();

  use(req: Request, res: Response, next: NextFunction) {
    res.on('finish', () => {
      const statusCode: number = res.statusCode;
      if (
        statusCode === HttpStatus.UNAUTHORIZED ||
        statusCode === HttpStatus.NOT_FOUND ||
        statusCode === HttpStatus.METHOD_NOT_ALLOWED
      ) {
        this.logger.warn(`[${req.method}] ${req.url} - ${statusCode}`);
      }
    });

    next();
  }
}
