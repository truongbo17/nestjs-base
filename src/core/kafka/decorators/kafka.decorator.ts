import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  UseFilters,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import {
  KafkaContext,
  MessagePattern,
  Payload,
  Transport,
} from '@nestjs/microservices';
import { KafkaResponseInterceptor } from '../interceptors/kafka.response.interceptor';
import { KafkaResponseTimeoutInterceptor } from '../interceptors/kafka.response.timeout.interceptor';
import { KafkaValidationPipe } from '../pipes/kafka.validation.pipe';
import { KafkaErrorFilter } from '../error/filters/kafka.error.filter';
import { KafkaCommitOffsetFirstInterceptor } from '../interceptors/kafka.commit-offset-first.interceptor';
import { IHeaders } from 'kafkajs';

export function MessageTopic(topic: string): any {
  return applyDecorators(
    MessagePattern(topic, Transport.KAFKA),
    UseInterceptors(KafkaResponseInterceptor, KafkaResponseTimeoutInterceptor),
    UseFilters(KafkaErrorFilter),
    UsePipes(KafkaValidationPipe)
  );
}

export const MessageValue = Payload;

export const MessageHeader = createParamDecorator<Record<string, any> | string>(
  (field: string, ctx: ExecutionContext): IHeaders | string[] | undefined => {
    const context: KafkaContext = ctx.switchToRpc().getContext();
    const headers: IHeaders | undefined = context.getMessage().headers;
    return field ? (headers ? headers : [field]) : headers;
  }
);

export const MessageKey = createParamDecorator<string>(
  (field: string, ctx: ExecutionContext): string => {
    const context: KafkaContext = ctx.switchToRpc().getContext();
    return context.getMessage()?.key?.toString() ?? '';
  }
);

export function MessageCommitOffsetInFirstRunning(): any {
  return applyDecorators(UseInterceptors(KafkaCommitOffsetFirstInterceptor));
}
