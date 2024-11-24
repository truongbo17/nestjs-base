import { DynamicModule, Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthJwtRefreshStrategy } from './guards/jwt/strategies/auth.jwt.refresh.strategy';
import { AuthJwtAccessStrategy } from './guards/jwt/strategies/auth.jwt.access.strategy';
import { EncryptionService } from './services/encryption.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('auth.jwt.defaultSecretKey'),
        signOptions: {
          expiresIn: configService.get<string>(
            'auth.jwt.defaultExpirationTime'
          ),
        },
      }),
    }),
  ],
  providers: [AuthService, EncryptionService],
  exports: [AuthService, EncryptionService],
})
export class AuthModule {
  static forRoot(): DynamicModule {
    return {
      module: AuthModule,
      providers: [AuthJwtAccessStrategy, AuthJwtRefreshStrategy],
      exports: [],
      controllers: [],
      imports: [],
    };
  }
}
