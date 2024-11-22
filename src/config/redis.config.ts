import { registerAs } from '@nestjs/config';
import { QueueConfigType } from './queue.config.type';
import validateConfig from '../utils/validate-config';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

const DEFAULT_PORT_REDIS: number = 6379;

class EnvironmentVariablesValidator {
  @IsNotEmpty()
  @IsString()
  REDIS_HOST: string;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  REDIS_PORT: number;

  @IsOptional()
  @IsString()
  REDIS_USERNAME?: string;

  @IsOptional()
  @IsString()
  REDIS_PASSWORD?: string;
}

export default registerAs<QueueConfigType>('redis', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    cached: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT
        ? parseInt(process.env.REDIS_PORT)
        : DEFAULT_PORT_REDIS,
      password: process.env.REDIS_PASSWORD,
      username: process.env.REDIS_USERNAME,
      ttl: 5 * 60000, // 5 min
      max: 100,
    },
    queue: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT
        ? parseInt(process.env.REDIS_PORT)
        : DEFAULT_PORT_REDIS,
      password: process.env.REDIS_PASSWORD,
      username: process.env.REDIS_USERNAME,
    },
  };
});
