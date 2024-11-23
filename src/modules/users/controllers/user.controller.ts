import {
  Body,
  Controller,
  Inject,
  InternalServerErrorException,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserCreateRequestDto } from '../dtos/requests/user.create.request.dto';
import { ApiTags } from '@nestjs/swagger';
import { UserRegisterDoc } from '../docs/user.user.doc';
import { I18nLangService } from '../../../common/i18n/services/i18n-lang.service';
import { DocResponse } from '../../../common/docs/decorators/doc.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { UploaderService } from '../../../common/files/services/uploader/upload.service';
import {
  IResponse,
  IResponseMetadata,
} from '../../../common/response/interfaces/response.interface';
import { UserService } from '../services/user.service';
import { AuthService } from '../../../core/auth/services/auth.service';

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
  @DocResponse('user.ok')
  @Post('/register')
  async register(
    @Body() { email, name, gender, password }: UserCreateRequestDto
  ): Promise<IResponse<IResponseMetadata>> {
    try {
      const emailExist: boolean = await this.userService.existByEmail(email);

      await this.authService.createPassword(password);
      throw new Error('a');
      console.log(emailExist);

      return {
        data: { id: 1 },
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
