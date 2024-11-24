export type AuthConfigType = {
  jwt: {
    accessToken: {
      secretKey: string;
      expirationTime: number | string;
    };

    refreshToken: {
      secretKey: string;
      expirationTime: number | string;
    };

    subject?: string;
    audience?: string;
    issuer?: string;
    prefixAuthorization: 'Bearer';

    secretKey: string;
    expirationTime: string | number;
    notBeforeExpirationTime: string | number;
  };

  password: {
    attempt: true;
    maxAttempt: 5;
    saltLength: 8;
    expiredIn: number | string;
    expiredInTemporary: number | string;
    period: number | string;
  };

  google: {
    clientId?: string;
    clientSecret?: string;
  };
};
