import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule.forRoot()],
  controllers: [],
  providers: [],
  exports: [],
})
export class CoreModule {}
