export type MiddlewareConfigType = {
  body: {
    json: {
      maxFileSize: number;
    };
    raw: {
      maxFileSize: number;
    };
    text: {
      maxFileSize: number;
    };
    urlencoded: {
      maxFileSize: number;
    };
  };
  timeout: number;
  cors: {
    allowMethod: string[];
    allowOrigin: string | boolean | string[];
    allowHeader: string[];
  };
  throttle: {
    ttl: number;
    limit: number;
  };
};
