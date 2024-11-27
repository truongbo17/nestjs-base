import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { RpcArgumentsHost } from '@nestjs/common/interfaces';
import { KafkaContext } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { KafkaService } from '../services/kafka.service';

@Injectable()
export class KafkaCommitOffsetFirstInterceptor
  implements NestInterceptor<Promise<any>>
{
  constructor(private readonly kafkaService: KafkaService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Promise<Observable<Promise<any> | string>> {
    const ctx: RpcArgumentsHost = context.switchToRpc();
    const kafkaContext = ctx.getContext<KafkaContext>();

    try {
      await this.kafkaService.commitOffsets(kafkaContext);
    } catch (error: unknown) {}

    return next.handle();
  }
}
