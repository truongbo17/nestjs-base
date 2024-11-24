import { IAuthPassword, IAuthPasswordOptions } from './auth.interface';
import { AuthJwtAccessPayloadDto } from '../dtos/jwt/auth.jwt.access-payload.dto';
import { AuthJwtRefreshPayloadDto } from '../dtos/jwt/auth.jwt.refresh-payload.dto';
import { ENUM_AUTH_LOGIN_FROM } from '../enums/auth.enum';
import { AuthLoginResponseDto } from '../dtos/response/auth.login.response.dto';
import { AuthSocialGooglePayloadDto } from '../dtos/social/auth.social.google-payload.dto';

export interface IAuthService {
  createAccessToken(
    subject: string,
    payload: AuthJwtAccessPayloadDto
  ): Promise<string>;

  validateAccessToken(subject: string, token: string): Promise<boolean>;

  payloadAccessToken(token: string): Promise<AuthJwtAccessPayloadDto>;

  createRefreshToken(
    subject: string,
    payload: AuthJwtRefreshPayloadDto
  ): Promise<string>;

  validateRefreshToken(subject: string, token: string): Promise<boolean>;

  payloadRefreshToken(token: string): Promise<AuthJwtRefreshPayloadDto>;

  validateUser(passwordString: string, passwordHash: string): Promise<boolean>;

  createPayloadAccessToken(
    data: object,
    session: string,
    loginDate: Date,
    loginFrom: ENUM_AUTH_LOGIN_FROM
  ): Promise<AuthJwtAccessPayloadDto>;

  createPayloadRefreshToken({
    id,
    loginFrom,
    loginDate,
  }: AuthJwtAccessPayloadDto): Promise<AuthJwtRefreshPayloadDto>;

  createSalt(length: number): Promise<string>;

  createPassword(
    password: string,
    options?: IAuthPasswordOptions
  ): Promise<IAuthPassword>;

  createPasswordRandom(): Promise<string>;

  checkPasswordExpired(passwordExpired: Date): Promise<boolean>;

  createToken(user: object, session: string): Promise<AuthLoginResponseDto>;

  getPasswordAttempt(): Promise<boolean>;

  getPasswordMaxAttempt(): Promise<number>;

  googleGetTokenInfo(accessToken: string): Promise<AuthSocialGooglePayloadDto>;
}
