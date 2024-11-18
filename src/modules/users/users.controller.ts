import { Controller, Get } from '@nestjs/common';
import tran from '../../utils/language';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Users')
@Controller({
  path: 'users',
  version: '1',
})
@Controller('users')
export class UsersController {
  @Get()
  async index() {
    const name = await tran(['user.name']);
    console.log(1, name);

    return {};
  }
}
