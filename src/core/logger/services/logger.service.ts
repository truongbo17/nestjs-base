import { Injectable, Logger, LogLevel } from '@nestjs/common';

@Injectable()
export class LoggerService {
  log(level: LogLevel, message: any, context: string): void {
    const logger: Logger = new Logger(context);
    switch (level) {
      case 'log':
        logger.log(message, context);
        break;
      case 'error':
        logger.error(message, context);
        break;
      case 'warn':
        logger.warn(message, context);
        break;
      case 'debug':
        logger.debug(message, context);
        break;
      case 'verbose':
        logger.verbose(message, context);
        break;
      default:
        logger.log(`Unknown log level: ${level}. Message: ${message}`, context);
        break;
    }
  }
}
