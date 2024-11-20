import { Controller, Get, HttpException, Inject, Logger } from '@nestjs/common';
import helpers from '../../utils/helpers';
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
  // constructor(
  //   @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  // ) {}

  private readonly logger = new Logger(UsersController.name);
  @Get()
  async index() {
    try {
      throw new HttpException('a', 404);
    } catch (e) {
      helpers.log('error', e, UsersController.name);
    }

    // const name = await tran(['user.name']);
    // console.log(1, name);

    return {};
  }
}
