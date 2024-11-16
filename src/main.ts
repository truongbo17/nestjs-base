import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from './config/config.type';

async function bootstrap() {
  const app: INestApplication<any> = await NestFactory.create(AppModule, {
    cors: true,
  });

  const configService: ConfigService<AllConfigType> = app.get(
    ConfigService<AllConfigType>,
  );

  await app.listen(configService.getOrThrow('app.port', { infer: true }));
}

void bootstrap();
