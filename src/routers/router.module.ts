import { Module } from '@nestjs/common';
import { RouterModule as NestJsRouterModule } from '@nestjs/core';
import { WelcomeModule } from '../modules/welcome/welcome.module';
import { UsersModule } from '../modules/users/users.module';
import { I18nLangModule } from '../core/i18n/i18n-lang.module';

@Module({
  imports: [
    WelcomeModule,
    UsersModule,
    NestJsRouterModule.register([
      {
        path: '/',
        module: WelcomeModule,
      },
      {
        path: '/user',
        module: UsersModule,
      },
    ]),
  ],
})
export class RouterModule {}
