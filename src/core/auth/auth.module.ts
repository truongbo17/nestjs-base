import { DynamicModule, Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';

@Module({
  imports: [],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {
  static forRoot(): DynamicModule {
    return {
      module: AuthModule,
      providers: [],
      exports: [],
      controllers: [],
      imports: [],
    };
  }
}
