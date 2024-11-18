import { Controller, Get, Inject } from '@nestjs/common';
import tran from '../../utils/language';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@ApiBearerAuth()
@ApiTags('Users')
@Controller({
  path: 'users',
  version: '1',
})
@Controller('users')
export class UsersController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  // private readonly logger = new Logger(UsersController.name);
  @Get()
  async index() {
    this.logger.error('a');

    const name = await tran(['user.name']);
    console.log(1, name);

    return {};
  }
}
