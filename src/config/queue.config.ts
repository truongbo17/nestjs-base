import { registerAs } from '@nestjs/config';
import { QueueConfigType } from './queue.config.type';
import validateConfig from '../utils/validate-config';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

class EnvironmentVariablesValidator {
  @IsInt()
  @Min(0)
  @Max(65535)
  @IsOptional()
  APP_PORT!: number;
}

export default registerAs<QueueConfigType>('queue', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {};
});
