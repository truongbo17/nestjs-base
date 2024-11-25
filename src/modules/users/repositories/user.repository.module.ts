import { Module } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';

@Module({
  providers: [UserRepository],
  exports: [UserRepository],
  controllers: [],
  imports: [TypeOrmModule.forFeature([UserEntity])],
})
export class UserRepositoryModule {}
