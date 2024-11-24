import { registerAs } from '@nestjs/config';
import ms from 'ms';
import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { AuthConfigType } from './auth.config.type';
import validateConfig from '../utils/validate-config';
import * as process from 'node:process';

class EnvironmentVariablesValidator {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  AUTH_JWT_AUDIENCE!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  AUTH_JWT_ISSUER!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  AUTH_JWT_ACCESS_TOKEN_EXPIRED!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  AUTH_JWT_ACCESS_TOKEN_SECRET_KEY!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  AUTH_JWT_REFRESH_TOKEN_EXPIRED!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  AUTH_JWT_REFRESH_TOKEN_SECRET_KEY!: string;

  @IsOptional()
  @IsString()
  AUTH_SOCIAL_GOOGLE_CLIENT_ID?: string;

  @IsOptional()
  @IsString()
  AUTH_SOCIAL_GOOGLE_CLIENT_SECRET?: string;
}

export default registerAs<AuthConfigType>('auth', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    jwt: {
      accessToken: {
        secretKey: process.env.AUTH_JWT_ACCESS_TOKEN_SECRET_KEY ?? '',
        expirationTime:
          ms(process.env.AUTH_JWT_ACCESS_TOKEN_EXPIRED ?? '15m') / 1000,
      },

      refreshToken: {
        secretKey: process.env.AUTH_JWT_REFRESH_TOKEN_SECRET_KEY ?? '',
        expirationTime:
          ms(process.env.AUTH_JWT_REFRESH_TOKEN_EXPIRED ?? '7d') / 1000,
      },

      subject: process.env.AUTH_JWT_SUBJECT,
      audience: process.env.AUTH_JWT_AUDIENCE,
      issuer: process.env.AUTH_JWT_ISSUER,
      prefixAuthorization: 'Bearer',

      secretKey: '123456',
      expirationTime: ms('1h'),
      notBeforeExpirationTime: ms('0'),
    },

    password: {
      attempt: true,
      maxAttempt: 5,
      saltLength: 8,
      expiredIn: ms('182d') / 1000, // 0.5 years
      expiredInTemporary: ms('3d') / 1000, // 3 days
      period: ms('90d') / 1000, // 3 months
    },

    google: {
      clientId: process.env.AUTH_SOCIAL_GOOGLE_CLIENT_ID,
      clientSecret: process.env.AUTH_SOCIAL_GOOGLE_CLIENT_SECRET,
    },
  };
});
