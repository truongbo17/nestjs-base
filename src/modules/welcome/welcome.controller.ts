import { Controller, Get, Render } from '@nestjs/common';
import { WelcomeService } from './welcome.service';

@Controller('')
export class WelcomeController {
  constructor(private readonly welcomeService: WelcomeService) {}

  @Render('welcome')
  @Get()
  async welcome() {
    return this.welcomeService.welcome();
  }
}
