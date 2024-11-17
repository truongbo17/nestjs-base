import { Controller, Get } from '@nestjs/common';
import tran from '../../utils/language';

@Controller('users')
export class UsersController {
  @Get()
  async index() {
    const name = await tran(['user.name']);
    console.log(1, name);

    return {};
  }
}
