import {
  Body,
  Controller,
  Inject,
  InternalServerErrorException,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserCreateRequestDto } from '../dtos/requests/user.create.request.dto';
import { ApiTags } from '@nestjs/swagger';
import { UserRegisterDoc } from '../docs/user.user.doc';
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
import dateHelper from '../../../utils/date.helper';
import { AuthSignUpRequestDto } from '../../../core/auth/dtos/request/auth.sign-up.request.dto';

@ApiTags('modules.user')
@Controller()
export class UserController {
  constructor(
    private readonly i18nService: I18nLangService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly uploadService: UploaderService,
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) {}

  @UserRegisterDoc()
  @Post('/register')
  @Response('auth.signUp')
  async register(
    @Body() { email, name, gender, password }: AuthSignUpRequestDto,
    @Req() request: Request
  ): Promise<IResponse<UserCreateResponseDto>> {
    try {
      const emailExist: boolean = await this.userService.existByEmail(email);

      await this.authService.createPassword(password);
      // throw new Error('a');
      // console.log(emailExist);

      return {
        data: {
          id: 1,
          createdAt: dateHelper.create(),
          updatedAt: dateHelper.create(),
        },
      };
    } catch (e) {
      throw new InternalServerErrorException({
        statusCode: 1,
        message: 'http.serverError.internalServerError',
        _error: e.message,
      });
    }
  }

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    // console.log(file);
    console.log(await this.uploadService.upload(file, 's3'));
  }
}
