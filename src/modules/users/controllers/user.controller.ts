import { Body, Controller, Post } from '@nestjs/common';
import { UserCreateRequestDto } from '../dtos/requests/user.create.request.dto';
import { ApiTags } from '@nestjs/swagger';
import { UserRegisterDoc } from '../docs/user.user.doc';

@ApiTags('modules.user')
@Controller()
export class UserController {
  @UserRegisterDoc()
  @Post('/register')
  async register(
    @Body() { email, name, gender, password }: UserCreateRequestDto,
  ) {}
}
