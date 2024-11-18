import { Module } from '@nestjs/common';
import { RouterModule as NestJsRouterModule } from '@nestjs/core';
import { WelcomeModule } from '../modules/welcome/welcome.module';
import { UsersModule } from '../modules/users/users.module';

@Module({
  imports: [
    UsersModule,
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
