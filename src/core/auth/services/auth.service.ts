import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoginTicket, OAuth2Client, TokenPayload } from 'google-auth-library';
import { plainToInstance } from 'class-transformer';
import { Duration } from 'luxon';
import { IAuthService } from '../interfaces/auth.service.interface';
import { EncryptionService } from './encryption.service';
import { AuthJwtAccessPayloadDto } from '../dtos/jwt/auth.jwt.access-payload.dto';
import { AuthJwtRefreshPayloadDto } from '../dtos/jwt/auth.jwt.refresh-payload.dto';
import hashHelper from '../../../utils/helper.hash';
import { ENUM_AUTH_LOGIN_FROM } from '../enums/auth.enum';
import {
  IAuthPassword,
  IAuthPasswordOptions,
} from '../interfaces/auth.interface';
import dateHelper from '../../../utils/date.helper';
import stringHelper from '../../../utils/helper.string';
import { AuthLoginResponseDto } from '../dtos/response/auth.login.response.dto';
import { AuthSocialGooglePayloadDto } from '../dtos/social/auth.social.google-payload.dto';
import { UserEntity } from '../../../modules/users/repository/entities/user.entity';

@Injectable()
export class AuthService implements IAuthService {
  // jwt
  private readonly jwtAccessTokenSecretKey: string;
  private readonly jwtAccessTokenExpirationTime: number;

  private readonly jwtRefreshTokenSecretKey: string;
  private readonly jwtRefreshTokenExpirationTime: number;

  private readonly jwtPrefixAuthorization: string;
  private readonly jwtAudience: string;
  private readonly jwtIssuer: string;

  // password
  private readonly passwordExpiredIn: number;
  private readonly passwordExpiredTemporary: number;
  private readonly passwordSaltLength: number;

  private readonly passwordAttempt: boolean;
  private readonly passwordMaxAttempt: number;

  // google
  private readonly googleClient: OAuth2Client;

  constructor(
    private readonly encryptionService: EncryptionService,
    private readonly configService: ConfigService
  ) {
    // jwt
    this.jwtAccessTokenSecretKey = <string>(
      this.configService.get<string>('auth.jwt.accessToken.secretKey')
    );
    this.jwtAccessTokenExpirationTime = <number>(
      this.configService.get<number>('auth.jwt.accessToken.expirationTime')
    );

    this.jwtRefreshTokenSecretKey = <string>(
      this.configService.get<string>('auth.jwt.refreshToken.secretKey')
    );
    this.jwtRefreshTokenExpirationTime = <number>(
      this.configService.get<number>('auth.jwt.refreshToken.expirationTime')
    );

    this.jwtPrefixAuthorization = <string>(
      this.configService.get<string>('auth.jwt.prefixAuthorization')
    );
    this.jwtAudience = <string>(
      this.configService.get<string>('auth.jwt.audience')
    );
    this.jwtIssuer = <string>this.configService.get<string>('auth.jwt.issuer');

    // password
    this.passwordExpiredIn = <number>(
      this.configService.get<number>('auth.password.expiredIn')
    );
    this.passwordExpiredTemporary = <number>(
      this.configService.get<number>('auth.password.expiredInTemporary')
    );
    this.passwordSaltLength = <number>(
      this.configService.get<number>('auth.password.saltLength')
    );

    this.passwordAttempt = <boolean>(
      this.configService.get<boolean>('auth.password.attempt')
    );
    this.passwordMaxAttempt = <number>(
      this.configService.get<number>('auth.password.maxAttempt')
    );

    // google
    this.googleClient = new OAuth2Client(
      this.configService.get<string>('auth.google.clientId'),
      this.configService.get<string>('auth.google.clientSecret')
    );
  }

  async createAccessToken(
    subject: string,
    payload: AuthJwtAccessPayloadDto
  ): Promise<string> {
    return this.encryptionService.jwtEncrypt(
      { ...payload },
      {
        secretKey: this.jwtAccessTokenSecretKey,
        expiredIn: this.jwtAccessTokenExpirationTime,
        audience: this.jwtAudience,
        issuer: this.jwtIssuer,
        subject,
      }
    );
  }

  async validateAccessToken(subject: string, token: string): Promise<boolean> {
    return this.encryptionService.jwtVerify(token, {
      secretKey: this.jwtAccessTokenSecretKey,
      audience: this.jwtAudience,
      issuer: this.jwtIssuer,
      subject,
    });
  }

  async payloadAccessToken(token: string): Promise<AuthJwtAccessPayloadDto> {
    return this.encryptionService.jwtDecrypt<AuthJwtAccessPayloadDto>(token);
  }

  async createRefreshToken(
    subject: string,
    payload: AuthJwtRefreshPayloadDto
  ): Promise<string> {
    return this.encryptionService.jwtEncrypt(
      { ...payload },
      {
        secretKey: this.jwtRefreshTokenSecretKey,
        expiredIn: this.jwtRefreshTokenExpirationTime,
        audience: this.jwtAudience,
        issuer: this.jwtIssuer,
        subject,
      }
    );
  }

  async validateRefreshToken(subject: string, token: string): Promise<boolean> {
    return this.encryptionService.jwtVerify(token, {
      secretKey: this.jwtRefreshTokenSecretKey,
      audience: this.jwtAudience,
      issuer: this.jwtIssuer,
      subject,
    });
  }

  async payloadRefreshToken(token: string): Promise<AuthJwtRefreshPayloadDto> {
    return this.encryptionService.jwtDecrypt<AuthJwtRefreshPayloadDto>(token);
  }

  async validateUser(
    passwordString: string,
    passwordHash: string
  ): Promise<boolean> {
    return hashHelper.bcryptCompare(passwordString, passwordHash);
  }

  async createPayloadAccessToken(
    data: UserEntity,
    session: number,
    loginDate: Date,
    loginFrom: ENUM_AUTH_LOGIN_FROM
  ): Promise<AuthJwtAccessPayloadDto> {
    return plainToInstance(AuthJwtAccessPayloadDto, {
      id: data.id,
      email: data.email,
      session,
      loginDate,
      loginFrom,
    });
  }

  async createPayloadRefreshToken({
    id,
    session,
    loginFrom,
    loginDate,
  }: AuthJwtAccessPayloadDto): Promise<AuthJwtRefreshPayloadDto> {
    return {
      id,
      session,
      loginFrom,
      loginDate,
    };
  }

  async createSalt(length: number): Promise<string> {
    return hashHelper.randomSalt(length);
  }

  async createPassword(
    password: string,
    options?: IAuthPasswordOptions
  ): Promise<IAuthPassword> {
    const salt: string = await this.createSalt(this.passwordSaltLength);

    const today = dateHelper.create();
    const passwordExpired: Date = dateHelper.forward(
      today,
      Duration.fromObject({
        seconds: options?.temporary
          ? this.passwordExpiredTemporary
          : this.passwordExpiredIn,
      })
    );
    const passwordCreated: Date = dateHelper.create();
    const passwordHash = hashHelper.bcrypt(password, salt);
    return {
      passwordHash,
      passwordExpired,
      passwordCreated,
      salt,
    };
  }

  async createPasswordRandom(): Promise<string> {
    return stringHelper.random(10);
  }

  async checkPasswordExpired(passwordExpired: Date): Promise<boolean> {
    const today: Date = dateHelper.create();
    const passwordExpiredConvert: Date = dateHelper.create(passwordExpired);

    return today > passwordExpiredConvert;
  }

  async createToken(
    user: UserEntity,
    session: number
  ): Promise<AuthLoginResponseDto> {
    const loginDate = dateHelper.create();

    const payloadAccessToken: AuthJwtAccessPayloadDto =
      await this.createPayloadAccessToken(
        user,
        session,
        loginDate,
        ENUM_AUTH_LOGIN_FROM.CREDENTIAL
      );
    const accessToken: string = await this.createAccessToken(
      user.email,
      payloadAccessToken
    );

    const payloadRefreshToken: AuthJwtRefreshPayloadDto =
      await this.createPayloadRefreshToken(payloadAccessToken);
    const refreshToken: string = await this.createRefreshToken(
      user.email,
      payloadRefreshToken
    );

    return {
      tokenType: this.jwtPrefixAuthorization,
      expiresIn: this.jwtAccessTokenExpirationTime,
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(
    user: UserEntity,
    refreshTokenFromRequest: string
  ): Promise<AuthLoginResponseDto> {
    const payloadRefreshToken =
      this.encryptionService.jwtDecrypt<AuthJwtRefreshPayloadDto>(
        refreshTokenFromRequest
      );
    const payloadAccessToken: AuthJwtAccessPayloadDto =
      await this.createPayloadAccessToken(
        user,
        payloadRefreshToken.session,
        payloadRefreshToken.loginDate,
        payloadRefreshToken.loginFrom
      );
    const accessToken: string = await this.createAccessToken(
      user.email,
      payloadAccessToken
    );

    return {
      tokenType: this.jwtPrefixAuthorization,
      expiresIn: this.jwtAccessTokenExpirationTime,
      accessToken,
      refreshToken: refreshTokenFromRequest,
    };
  }

  async getPasswordAttempt(): Promise<boolean> {
    return this.passwordAttempt;
  }

  async getPasswordMaxAttempt(): Promise<number> {
    return this.passwordMaxAttempt;
  }

  async googleGetTokenInfo(
    idToken: string
  ): Promise<AuthSocialGooglePayloadDto> {
    const login: LoginTicket = await this.googleClient.verifyIdToken({
      idToken: idToken,
      audience: [
        this.configService.getOrThrow('auth.google.clientId', { infer: true }),
      ],
    });
    const payload: TokenPayload | undefined = login.getPayload();

    if (!payload) {
      throw new Error('No payload for google verify');
    }

    return { email: <string>payload.email };
  }
}
