import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { AuthModule } from '../../core/auth/auth.module';
import { UserRepositoryModule } from './repositories/user.repository.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
  imports: [AuthModule, UserRepositoryModule],
})
export class UsersModule {}
