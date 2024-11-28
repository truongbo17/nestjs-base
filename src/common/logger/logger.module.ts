import { Global, Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { format, transports } from 'winston';
import 'winston-daily-rotate-file';
import { LoggerService } from './services/logger.service';
import process from 'node:process';

@Global()
@Module({})
export class LoggerModule {
  static forRoot(isHttp: boolean = true) {
    return {
      module: LoggerModule,
      imports: [
        WinstonModule.forRoot({
          transports: [
            new winston.transports.Console({
              format: winston.format.combine(
                winston.format.timestamp({
                  format: 'YYYY-MM-DD HH:mm:ss',
                }),
                winston.format.colorize({ all: true }),
                winston.format.printf(
                  ({ timestamp, level, message, context }) => {
                    return `${timestamp} \x1b[36m[${context || 'Application'} - ${isHttp ? 'HttpContext' : 'CommandContext'}]\x1b[0m ${level}: ${message}`;
                  }
                )
              ),
            }),
            // same for all levels
            new transports.DailyRotateFile({
              filename: process.cwd() + `/logs/%DATE%.log`,
              format: format.combine(
                winston.format.timestamp({
                  format: 'YYYY-MM-DD HH:mm:ss',
                }),
                format.json()
              ),
              datePattern: 'YYYY-MM-DD',
              zippedArchive: false,
              maxFiles: '30d',
            }),
          ],
        }),
      ],
      providers: [LoggerService],
      exports: [LoggerService],
    };
  }
}
