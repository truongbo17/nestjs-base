import { Module } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';

@Module({
  providers: [UserRepository],
  exports: [UserRepository],
  controllers: [],
  imports: [],
})
export class UserRepositoryModule {}
