import { Module } from '@nestjs/common';
import { RouterModule as NestJsRouterModule } from '@nestjs/core';
import { WelcomeModule } from '../modules/welcome/welcome.module';

@Module({
  imports: [
    WelcomeModule,
    NestJsRouterModule.register([
      {
        path: '/',
        module: WelcomeModule,
      },
    ]),
  ],
})
export class RouterModule {}
