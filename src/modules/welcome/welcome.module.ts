import { Module } from '@nestjs/common';
import { WelcomeController } from './welcome.controller';
import { WelcomeService } from './welcome.service';

@Module({
  providers: [WelcomeService],
  controllers: [WelcomeController],
})
export class WelcomeModule {}
