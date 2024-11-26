import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { AuthModule } from '../../core/auth/auth.module';
import { UserRepositoryModule } from './repositories/user.repository.module';
import { BullModule } from '@nestjs/bullmq';
import { ENUM_WORKER_QUEUES } from '../../workers/enums/worker.enum';

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
  ],
})
export class UsersModule {}
