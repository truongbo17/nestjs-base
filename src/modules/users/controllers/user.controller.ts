import { Body, Controller, Post } from '@nestjs/common';
import { UserCreateRequestDto } from '../dtos/requests/user.create.request.dto';
import { ApiTags } from '@nestjs/swagger';
import { UserRegisterDoc } from '../docs/user.user.doc';
import { I18nLangService } from '../../../core/i18n/services/i18n-lang.service';

@ApiTags('modules.user')
@Controller()
export class UserController {
  constructor(private readonly i18nService: I18nLangService) {}

  @UserRegisterDoc()
  @Post('/register')
  async register(
    @Body() { email, name, gender, password }: UserCreateRequestDto,
  ) {
    console.log(await this.i18nService.tran('user.name'));
  }
}
