import { Logger, Module } from '@nestjs/common';
import { GetCurrentVersionCommand } from './get-current-version.command';
import { ConsoleModule } from 'nestjs-console';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { format, transports } from 'winston';
import 'winston-daily-rotate-file';

@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp({
              format: 'YYYY-MM-DD HH:mm:ss',
            }),
            winston.format.colorize({ all: true }),
            winston.format.printf(({ timestamp, level, message, context }) => {
              return `${timestamp} \x1b[36m[${context || 'CommandApplication'} - Command]\x1b[0m ${level}: ${message}`;
            }),
          ),
        }),
        // same for all levels
        new transports.DailyRotateFile({
          filename: `logs/%DATE%.log`,
          format: format.combine(
            winston.format.timestamp({
              format: 'YYYY-MM-DD HH:mm:ss',
            }),
            format.json(),
          ),
          datePattern: 'YYYY-MM-DD',
          zippedArchive: false,
          maxFiles: '30d',
        }),
      ],
    }),
    ConsoleModule,
  ],
  providers: [GetCurrentVersionCommand, Logger],
})
export class AppCommandModule {}
