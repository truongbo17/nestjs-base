import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { RpcException } from '@nestjs/microservices';
import { APP_STATUS_CODE_ERROR } from '../../app/enums/app.enum';

@Injectable()
export class KafkaResponseTimeoutInterceptor
  implements NestInterceptor<Promise<any>>
{
  private readonly timeout: number;

  constructor(private readonly configService: ConfigService) {
    this.timeout = <number>(
      this.configService.get<number>('kafka.producerSend.timeout')
    );
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Promise<Observable<Promise<any> | string>> {
    return next.handle().pipe(
      timeout(this.timeout),
      catchError(err => {
        if (err instanceof TimeoutError) {
          throw new RpcException({
            statusCode: APP_STATUS_CODE_ERROR.APP_TIMEOUT,
            message: 'http.clientError.requestTimeOut',
          });
        }
        return throwError(() => err);
      })
    );

    return next.handle();
  }
}
