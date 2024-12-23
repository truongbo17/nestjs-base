import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { AllConfigType } from '../../config/config.type';
import { Environment } from '../../config/app.config';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService<AllConfigType>) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    let extras: object = {};
    if (
      ['postgres'].includes(
        <string>this.configService.get('database.type', { infer: true })
      )
    ) {
      // max connection pool size
      extras = {
        ...extras,
        ...{
          max: this.configService.get('database.maxConnections', {
            infer: true,
          }),
        },
      };
    }

    return {
      type: this.configService.get('database.type', { infer: true }),
      url: this.configService.get('database.url', { infer: true }),
      host: this.configService.get('database.host', { infer: true }),
      port: this.configService.get('database.port', { infer: true }),
      username: this.configService.get('database.username', { infer: true }),
      password: this.configService.get('database.password', { infer: true }),
      database: this.configService.get('database.name', { infer: true }),
      synchronize: this.configService.get('database.synchronize', {
        infer: true,
      }),
      dropSchema: false,
      keepConnectionAlive: true,
      logging:
        this.configService.get('app.appEnv', { infer: true }) !==
        Environment.PRODUCTION,
      entities: [__dirname + '/../../../**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/../../../database/migrations/**/*{.ts,.js}'],
      cli: {
        entitiesDir: 'src',

        subscribersDir: 'subscriber',
      },
      extra: {
        ...{
          // based on https://node-postgres.com/apis/pool
          ssl: this.configService.get('database.sslEnabled', { infer: true })
            ? {
                rejectUnauthorized: this.configService.get(
                  'database.rejectUnauthorized',
                  { infer: true }
                ),
                ca:
                  this.configService.get('database.ca', { infer: true }) ??
                  undefined,
                key:
                  this.configService.get('database.key', { infer: true }) ??
                  undefined,
                cert:
                  this.configService.get('database.cert', { infer: true }) ??
                  undefined,
              }
            : undefined,
        },
        ...extras,
      },
    } as TypeOrmModuleOptions;
  }
}
