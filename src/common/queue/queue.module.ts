import { Global, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('redis.queue.host'),
          port: configService.get<number>('redis.queue.port'),
          username: configService.get<string>('redis.queue.username'),
          password: configService.get<string>('redis.queue.password'),
          tls: configService.get<any>('redis.queue.tls'),
        },
        defaultJobOptions: {
          backoff: {
            type: 'exponential',
            delay: 3000,
          },
          attempts: 3,
        },
      }),
    }),
  ],
})
export class QueueModule {}
