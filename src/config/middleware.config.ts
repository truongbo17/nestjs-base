import { registerAs } from '@nestjs/config';
import bytes from 'bytes';
import ms from 'ms';
import validateConfig from '../utils/validate-config';
import * as process from 'node:process';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { MiddlewareConfigType } from './middleware.config.type';

class EnvironmentVariablesValidator {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  APP_ALLOW_CORS_ORIGIN: string;
}

export default registerAs<MiddlewareConfigType>('middleware', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    body: {
      json: {
        maxFileSize: bytes('100kb'), // 100kb
      },
      raw: {
        maxFileSize: bytes('100kb'), // 100kb
      },
      text: {
        maxFileSize: bytes('100kb'), // 100kb
      },
      urlencoded: {
        maxFileSize: bytes('100kb'), // 100kb
      },
    },
    timeout: ms('30s'), // 30s based on ms module
    cors: {
      allowMethod: ['GET', 'DELETE', 'PUT', 'PATCH', 'POST', 'HEAD'],
      allowOrigin: process.env.APP_ALLOW_CORS_ORIGIN?.split(',') ?? [],
      allowHeader: [
        'Accept',
        'Accept-Language',
        'Content-Language',
        'Content-Type',
        'Origin',
        'Authorization',
        'Access-Control-Request-Method',
        'Access-Control-Request-Headers',
        'Access-Control-Allow-Headers',
        'Access-Control-Allow-Origin',
        'Access-Control-Allow-Methods',
        'Access-Control-Allow-Credentials',
        'Access-Control-Expose-Headers',
        'Access-Control-Max-Age',
        'Referer',
        'Host',
        'X-Requested-With',
        'x-custom-lang',
        'x-timestamp',
        'x-api-key',
        'x-timezone',
        'x-request-id',
        'x-version',
        'x-repo-version',
        'X-Response-Time',
        'user-agent',
      ],
    },
    throttle: {
      ttl: ms('500'), // 0.5 secs
      limit: 10, // max request per reset time
    },
  };
});
