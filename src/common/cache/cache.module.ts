import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  CacheModule as CacheManagerModule,
  CacheOptions,
  CacheStore,
} from '@nestjs/cache-manager';
import { ENUM_CACHE_STORE } from '../../config/app.config';
import { redisStore, RedisStore } from 'cache-manager-redis-store';

@Global()
@Module({
  imports: [
    CacheManagerModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (
        configService: ConfigService
      ): Promise<CacheOptions> => {
        const storeCache: string = <string>configService.get('app.cacheStore', {
          infer: true,
        });

        if (storeCache === ENUM_CACHE_STORE.REDIS) {
          const store: RedisStore = await redisStore({
            socket: {
              host: configService.get<string>('redis.cached.host'),
              port: configService.get<number>('redis.cached.port'),
              tls: configService.get<boolean>('redis.cached.tls'),
            },
            username: configService.get<string>('redis.cached.username'),
            password: configService.get<string>('redis.cached.password'),
          });

          return {
            store: store as any as CacheStore,
            max: configService.get<number>('redis.cached.max'),
            ttl: configService.get<number>('redis.cached.ttl'),
          };
        } else {
          return {
            max: configService.get<number>('redis.cached.max'),
            ttl: configService.get<number>('redis.cached.ttl'),
          };
        }
      },
      inject: [ConfigService],
    }),
  ],
})
export class CacheModule {}
