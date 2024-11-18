import { Logger, LogLevel } from '@nestjs/common';

const helpers = {
  wrapArray(value: any | any[]): any[] {
    return Array.isArray(value) ? value : [value];
  },
  log(level: LogLevel, message: any, context: string): void {
    const logger: Logger = new Logger(context);
    switch (level) {
      case 'log':
        logger.log(message);
        break;
      case 'error':
        logger.error(message);
        break;
      case 'warn':
        logger.warn(message);
        break;
      case 'debug':
        logger.debug(message);
        break;
      case 'verbose':
        logger.verbose(message);
        break;
      default:
        logger.log(`Unknown log level: ${level}. Message: ${message}`);
        break;
    }
  },
};

export default helpers;
