export type RedisConfigType = {
  cached: {
    host: string;
    port: number;
    password?: string;
    username?: string;
    ttl: number;
    max: number;
  };
  queue: {
    host: string;
    port: number;
    password?: string;
    username?: string;
  };
};
