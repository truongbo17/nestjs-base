import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from './config/config.type';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'node:path';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import * as process from 'node:process';
import { Environment } from './config/app.config';
import helmet from 'helmet';

async function bootstrap() {
  // Run HTTP server
  const app: NestExpressApplication =
    await NestFactory.create<NestExpressApplication>(AppModule, {
      cors: true,
    });

  // Get config
  const configService: ConfigService<AllConfigType> = app.get(
    ConfigService<AllConfigType>
  );

  process.env.NODE_ENV = configService.getOrThrow('app.appEnv', {
    infer: true,
  });

  process.env.TZ = configService.getOrThrow('app.timezone', { infer: true });

  // Views
  app.useStaticAssets(
    join(
      __dirname,
      '..',
      configService.getOrThrow('view.pathPublic', { infer: true })
    )
  );
  app.useStaticAssets(
    join(
      __dirname,
      '..',
      configService.getOrThrow('view.pathView', { infer: true })
    )
  );
  app.setViewEngine(configService.getOrThrow('view.engine', { infer: true }));

  // Logger
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  if (process.env.NODE_ENV !== Environment.PRODUCTION) {
    // Swagger
    const options = new DocumentBuilder()
      .setTitle('API')
      .setDescription('API docs')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('docs', app, document);
  }

  await app.listen(configService.getOrThrow('app.port', { infer: true }));
}

void bootstrap();
