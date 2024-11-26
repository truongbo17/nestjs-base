import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { AuthModule } from '../../core/auth/auth.module';
import { UserRepositoryModule } from './repository/user.repository.module';
import { BullModule } from '@nestjs/bullmq';
import { ENUM_WORKER_QUEUES } from '../../workers/enums/worker.enum';
import { SessionModule } from '../session/session.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
  imports: [
    AuthModule.forRoot(),
    UserRepositoryModule,
    BullModule.registerQueueAsync({
      name: ENUM_WORKER_QUEUES.EMAIL_REGISTER_QUEUE,
    }),
    SessionModule,
  ],
})
export class UsersModule {}
