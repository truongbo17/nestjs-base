import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { enc, SHA256 } from 'crypto-js';

const hashHelper = {
  randomSalt(length: number): string {
    return genSaltSync(length);
  },

  bcrypt(passwordString: string, salt: string): string {
    return hashSync(passwordString, salt);
  },

  bcryptCompare(passwordString: string, passwordHashed: string): boolean {
    return compareSync(passwordString, passwordHashed);
  },

  sha256(string: string): string {
    return SHA256(string).toString(enc.Hex);
  },

  sha256Compare(hashOne: string, hashTwo: string): boolean {
    return hashOne === hashTwo;
  },
};

export default hashHelper;
