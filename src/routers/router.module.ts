import { Module } from '@nestjs/common';
import { RouterModule as NestJsRouterModule } from '@nestjs/core';
import { WelcomeModule } from '../modules/welcome/welcome.module';
import { UsersModule } from '../modules/users/users.module';
import { FileModule } from '../modules/file/file.module';

@Module({
  imports: [
    WelcomeModule,
    UsersModule,
    FileModule,
    NestJsRouterModule.register([
      {
        path: '/view',
        children: [
          {
            path: '/welcome',
            module: WelcomeModule,
          },
        ],
      },
      {
        path: '/user',
        module: UsersModule,
      },
    ]),
  ],
})
export class RouterModule {}
