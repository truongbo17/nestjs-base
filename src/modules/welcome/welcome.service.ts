import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '../../config/config.type';

@Injectable()
export class WelcomeService {
  constructor(private readonly configService: ConfigService<AllConfigType>) {}

  async welcome() {
    return {
      appName: this.configService.getOrThrow('app.name', { infer: true }),
    };
  }
}
