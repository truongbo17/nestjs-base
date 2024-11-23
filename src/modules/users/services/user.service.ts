import { UserServiceInterface } from '../interfaces/user.service.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService implements UserServiceInterface {
  async existByEmail(email: string): Promise<boolean> {
    return true;
  }

  async register() {}
}
