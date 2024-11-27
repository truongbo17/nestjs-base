import { ArgumentsHost, Catch, Logger } from '@nestjs/common';
import {
  RpcArgumentsHost,
  RpcExceptionFilter,
} from '@nestjs/common/interfaces';
import { KafkaContext, RpcException } from '@nestjs/microservices';
import { Observable, of } from 'rxjs';

@Catch(RpcException)
export class KafkaErrorFilter implements RpcExceptionFilter<RpcException> {
  private readonly logger: Logger = new Logger(KafkaErrorFilter.name);

  catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
    const ctx: RpcArgumentsHost = host.switchToRpc();
    const { __class, __function } = ctx.getData();
    const { key } = ctx.getContext<KafkaContext>().getMessage();

    // Debugger
    try {
      this.logger.error(
        key ? key.toString() : KafkaErrorFilter.name,
        {
          description: exception.message,
          class: __class,
          function: __function,
        },
        exception
      );
    } catch (err: unknown) {}

    return of(JSON.stringify({ error: exception.getError() }));
  }
}
