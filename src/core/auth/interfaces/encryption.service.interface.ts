export interface IHelperJwtVerifyOptions {
  audience: string;
  issuer: string;
  subject: string;
  secretKey: string;
  ignoreExpiration?: boolean;
}

export interface IHelperJwtOptions
  extends Omit<IHelperJwtVerifyOptions, 'ignoreExpiration'> {
  expiredIn: number | string;
  notBefore?: number | string;
}

export interface IHelperEncryptionService {
  base64Encrypt(data: string): string;

  base64Decrypt(data: string): string;

  base64Compare(basicToken1: string, basicToken2: string): boolean;

  aes256Encrypt<T = Record<string, any>>(
    data: T,
    key: string,
    iv: string
  ): string;

  aes256Decrypt<T = Record<string, any>>(
    encrypted: string,
    key: string,
    iv: string
  ): T;

  aes256Compare(aes1: string, aes2: string): boolean;

  jwtEncrypt(payload: Record<string, any>, options: IHelperJwtOptions): string;

  jwtDecrypt<T>(token: string): T;

  jwtVerify(token: string, options: IHelperJwtVerifyOptions): boolean;
}
