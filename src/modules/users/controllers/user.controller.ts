import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  Inject,
  InternalServerErrorException,
  NotFoundException,
  Post,
  Req,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { I18nLangService } from '../../../common/i18n/services/i18n-lang.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { UploaderService } from '../../../common/files/services/uploader/upload.service';
import { IResponse } from '../../../common/response/interfaces/response.interface';
import { UserService } from '../services/user.service';
import { AuthService } from '../../../core/auth/services/auth.service';
import { Request } from 'express';
import { Response } from 'src/common/response/decorators/response.decorator';
import { UserCreateResponseDto } from '../dtos/responses/user.create.response.dto';
import { AuthSignUpRequestDto } from '../../../core/auth/dtos/request/auth.sign-up.request.dto';
import { IAuthPassword } from '../../../core/auth/interfaces/auth.interface';
import { ENUM_USER_STATUS_CODE_ERROR } from '../enums/user.status-code.enum';
import { APP_STATUS_CODE_ERROR } from '../../../core/app/enums/app.enum';
import { UserEntity } from '../repository/entities/user.entity';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { ENUM_WORKER_QUEUES } from '../../../workers/enums/worker.enum';
import { AuthLoginRequestDto } from '../../../core/auth/dtos/request/auth.login.request.dto';
import { UserRegisterDoc } from '../docs/user.register.doc';
import {
  UserLoginCredentialDoc,
  UserLoginSocialGoogleDoc,
} from '../docs/user.login.doc';
import { ENUM_USER_STATUS } from '../enums/user.enum';
import {
  AuthJwtAccessProtected,
  AuthJwtPayload,
  AuthJwtRefreshProtected,
  AuthJwtToken,
} from '../../../core/auth/decorators/auth.jwt.decorator';
import { UserUploadAvatarDoc } from '../docs/user.upload-avatar.doc';
import { SessionService } from '../../session/services/session.service';
import crypto from 'crypto';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { SessionEntity } from '../../session/repository/entities/session.entity';
import { AuthSocialGoogleProtected } from '../../../core/auth/decorators/auth.social.decorator';
import { AuthSocialGooglePayloadDto } from '../../../core/auth/dtos/social/auth.social.google-payload.dto';
import { AuthLoginResponseDto } from '../../../core/auth/dtos/response/auth.login.response.dto';
import { UserRefreshTokenDoc } from '../docs/user.refresh-token.doc';
import { AuthJwtRefreshPayloadDto } from '../../../core/auth/dtos/jwt/auth.jwt.refresh-payload.dto';
import { AuthRefreshResponseDto } from '../../../core/auth/dtos/response/auth.refresh.response.dto';
import { ENUM_SESSION_STATUS_CODE_ERROR } from '../../session/enums/session.status-code.enum';
import { AuthJwtAccessPayloadDto } from '../../../core/auth/dtos/jwt/auth.jwt.access-payload.dto';

@ApiTags('modules.user')
@Controller()
export class UserController {
  constructor(
    private readonly i18nService: I18nLangService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly uploadService: UploaderService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
    @InjectQueue(ENUM_WORKER_QUEUES.EMAIL_REGISTER_QUEUE)
    private readonly emailQueue: Queue,
    private readonly sessionService: SessionService
  ) {}

  @UserRegisterDoc()
  @Post('/register')
  @Response('auth.register')
  async register(
    @Body() { email, name, gender, password }: AuthSignUpRequestDto,
    @Req() request: Request
  ): Promise<IResponse<UserCreateResponseDto>> {
    const emailExist: boolean = await this.userService.existByEmail(email);
    if (emailExist) {
      throw new ConflictException({
        statusCode: ENUM_USER_STATUS_CODE_ERROR.EMAIL_EXIST,
        message: 'user.error.emailExist',
      });
    }

    try {
      const passwordHash: IAuthPassword =
        await this.authService.createPassword(password);

      const user: UserEntity = await this.userService.create(
        {
          email,
          name,
          gender,
        },
        passwordHash
      );

      await this.emailQueue.add(
        ENUM_WORKER_QUEUES.EMAIL_REGISTER_QUEUE,
        {
          send: { email, name },
        },
        {
          debounce: {
            id: `${ENUM_WORKER_QUEUES.EMAIL_REGISTER_QUEUE}-${user.id}`,
            ttl: 1000,
          },
        }
      );

      return {
        data: user,
      };
    } catch (e) {
      throw new InternalServerErrorException({
        statusCode: APP_STATUS_CODE_ERROR.APP_ERROR,
        message: 'http.serverError.internalServerError',
        _error: e.message,
      });
    }
  }

  @UserLoginCredentialDoc()
  @Post('login/credential')
  @Response('auth.loginWithCredential')
  async loginWithCredential(
    @Body() { email, password }: AuthLoginRequestDto
  ): Promise<IResponse<AuthLoginResponseDto>> {
    const user: UserEntity | null =
      await this.userService.findOneByEmail(email);
    if (!user || !user.password) {
      throw new NotFoundException({
        statusCode: ENUM_USER_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'user.error.notFound',
      });
    }

    const validate: boolean = await this.authService.validateUser(
      password,
      user.password
    );
    if (!validate) {
      throw new BadRequestException({
        statusCode: ENUM_USER_STATUS_CODE_ERROR.PASSWORD_NOT_MATCH,
        message: 'auth.error.passwordNotMatch',
      });
    } else if (user.status !== ENUM_USER_STATUS.ACTIVE) {
      throw new ForbiddenException({
        statusCode: ENUM_USER_STATUS_CODE_ERROR.INACTIVE_FORBIDDEN,
        message: 'user.error.inactive',
      });
    }

    const hash: string = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');

    const session: SessionEntity = await this.sessionService.create({
      user_id: user.id,
      hash: hash,
    });

    const token: AuthLoginResponseDto = await this.authService.createToken(
      user,
      session.id
    );

    return {
      data: token,
    };
  }

  @UserLoginSocialGoogleDoc()
  @AuthSocialGoogleProtected()
  @Response('auth.loginWithSocialGoogle')
  @Post('login/google')
  async loginWithGoogle(
    @AuthJwtPayload<AuthSocialGooglePayloadDto>()
    { email }: AuthSocialGooglePayloadDto
  ): Promise<IResponse<AuthLoginResponseDto>> {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException({
        statusCode: ENUM_USER_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'user.error.notFound',
      });
    } else if (user.status !== ENUM_USER_STATUS.ACTIVE) {
      throw new ForbiddenException({
        statusCode: ENUM_USER_STATUS_CODE_ERROR.INACTIVE_FORBIDDEN,
        message: 'user.error.inactive',
      });
    }

    const hash: string = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');

    const session: SessionEntity = await this.sessionService.create({
      user_id: user.id,
      hash: hash,
    });

    const token: AuthLoginResponseDto = await this.authService.createToken(
      user,
      session.id
    );

    return {
      data: token,
    };
  }

  @UserRefreshTokenDoc()
  @Response('auth.refresh')
  @AuthJwtRefreshProtected()
  @Post('refresh')
  async refresh(
    @AuthJwtToken() refreshToken: string,
    @AuthJwtPayload<AuthJwtRefreshPayloadDto>()
    { id, session }: AuthJwtRefreshPayloadDto
  ): Promise<IResponse<AuthRefreshResponseDto>> {
    const sessionActive: Promise<SessionEntity | null> =
      this.sessionService.findById(session);

    if (!sessionActive) {
      throw new UnauthorizedException({
        statusCode: ENUM_SESSION_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'session.error.notFound',
      });
    }

    const user: UserEntity | null = await this.userService.findOneById(id);
    if (!user) {
      throw new NotFoundException({
        statusCode: ENUM_USER_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'user.error.notFound',
      });
    } else if (user.status !== ENUM_USER_STATUS.ACTIVE) {
      throw new ForbiddenException({
        statusCode: ENUM_USER_STATUS_CODE_ERROR.INACTIVE_FORBIDDEN,
        message: 'user.error.inactive',
      });
    }

    const token: AuthLoginResponseDto = await this.authService.refreshToken(
      user,
      refreshToken
    );

    return {
      data: token,
    };
  }

  @UserUploadAvatarDoc()
  @AuthJwtAccessProtected()
  @Post('avatar/upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @AuthJwtPayload<AuthJwtAccessPayloadDto>() { id }: AuthJwtAccessPayloadDto
  ) {
    console.log(id);
    // console.log(file);
    console.log(await this.uploadService.upload(file, 's3'));
  }
}
