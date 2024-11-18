import { Controller, Get } from '@nestjs/common';
import { WelcomeService } from './welcome.service';

@Controller('')
export class WelcomeController {
  constructor(private readonly welcomeService: WelcomeService) {}

  @Get()
  async welcome() {
    return this.welcomeService.welcome();
  }
}
