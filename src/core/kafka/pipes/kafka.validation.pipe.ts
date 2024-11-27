import {
  HttpStatus,
  Injectable,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { APP_STATUS_CODE_ERROR } from '../../app/enums/app.enum';

@Injectable()
export class KafkaValidationPipe extends ValidationPipe {
  constructor() {
    super({
      transform: true,
      skipNullProperties: false,
      skipUndefinedProperties: false,
      skipMissingProperties: false,
      exceptionFactory: (errors: ValidationError[]) =>
        new RpcException({
          statusCode: APP_STATUS_CODE_ERROR.APP_TIMEOUT,
          message: 'http.clientError.unprocessableEntity',
          errors,
          statusHttp: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    });
  }
}
