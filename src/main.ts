import { NestApplication, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from './config/config.type';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'node:path';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import * as process from 'node:process';
import { Environment } from './config/app.config';
import compression from 'compression';
import { useContainer } from 'class-validator';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import kafkaInit from './kafka';

async function bootstrap() {
  // Run HTTP server
  const app: NestApplication = await NestFactory.create(AppModule, {
    cors: true,
  });

  // Get config
  const configService: ConfigService<AllConfigType> = app.get(
    ConfigService<AllConfigType>
  );

  // Logger
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  // Env
  process.env.NODE_ENV = configService.getOrThrow('app.appEnv', {
    infer: true,
  });
  process.env.TZ = configService.getOrThrow('app.timezone', { infer: true });

  // Compression
  app.use(compression());

  // Global prefix
  const globalPrefix = configService.get('app.apiPrefix', { infer: true });
  if (globalPrefix) {
    app.setGlobalPrefix(globalPrefix, { exclude: ['view/(.*)'] });
  }

  // For Custom Validation
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalPipes(new ValidationPipe());

  // Versioning
  const versionEnable: boolean = configService.get<boolean>(
    'app.urlVersion.enable',
    { infer: true }
  );
  if (versionEnable) {
    const versioningPrefix: string = configService.getOrThrow(
      'app.urlVersion.prefix',
      { infer: true }
    );
    const version: number = <number>configService.getOrThrow(
      'app.urlVersion.version',
      {
        infer: true,
      }
    );
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: `${version}`,
      prefix: versioningPrefix,
    });
  }

  // Views
  app.useStaticAssets(
    join(
      __dirname,
      '..',
      configService.getOrThrow('view.pathPublic', { infer: true })
    )
  );

  app.setViewEngine(configService.getOrThrow('view.engine', { infer: true }));
  app.setBaseViewsDir(
    join(
      __dirname,
      '..',
      configService.getOrThrow('view.pathView', { infer: true })
    )
  );

  // Kafka
  if (<boolean>configService.get('kafka.enable', { infer: true })) {
    await kafkaInit(app);
  }

  if (process.env.NODE_ENV !== Environment.PRODUCTION) {
    // Swagger
    const options = new DocumentBuilder()
      .setTitle('API')
      .setDescription('API docs')
      .setVersion('1.0')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'accessToken'
      )
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'refreshToken'
      )
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'google'
      )
      .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('docs', app, document);
  }

  await app.listen(configService.getOrThrow('app.port', { infer: true }));
}

void bootstrap();
