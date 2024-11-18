import { Injectable, Render } from '@nestjs/common';

@Injectable()
export class WelcomeService {
  @Render('welcome.hbs')
  async welcome() {
    return {
      title: 'Base',
    };
  }
}
