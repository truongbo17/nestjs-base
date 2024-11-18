import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WelcomeService {
  constructor(private readonly configService: ConfigService) {}

  async welcome() {
    return {
      appName: this.configService.getOrThrow('app.name', { infer: true }),
    };
  }
}
