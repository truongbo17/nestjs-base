import {
  Body,
  Controller,
  Inject,
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

@ApiTags('modules.user')
@Controller()
export class UserController {
  constructor(
    private readonly i18nService: I18nLangService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly uploadService: UploaderService
  ) {}

  @UserRegisterDoc()
  @DocResponse('user.ok')
  @Post('/register')
  async register(
    @Body() { email, name, gender, password }: UserCreateRequestDto
  ) {
    console.log(1, await this.cacheManager.get('a'));
    await this.cacheManager.set('a', 'c');
    console.log(2, await this.cacheManager.get('a'));
    // console.log(await this.i18nService.tran('user.name'));
    // throw new Error('aasd');
    return {
      a: true,
    };
  }

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    console.log(await this.uploadService.upload(file, 'local'));
  }
}
