import { HttpException, HttpStatus } from '@nestjs/common';
import { IKafkaErrorException } from '../../interfaces/kafka.interface';
import { APP_STATUS_CODE_ERROR } from '../../../app/enums/app.enum';

export class KafkaHttpException extends HttpException {
  constructor(exception: IKafkaErrorException) {
    if (
      'message' in exception &&
      'statusCode' in exception &&
      'statusHttp' in exception
    ) {
      const { statusHttp, ...data } = exception;
      super(data, statusHttp);
    } else {
      super(
        {
          statusCode: APP_STATUS_CODE_ERROR.APP_ERROR_UNKNOWN,
          message: 'http.serverError.internalServerError',
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
