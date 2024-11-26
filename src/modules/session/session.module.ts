import { Module } from '@nestjs/common';
import { SessionService } from './services/session.service';
import { SessionRepositoryModule } from './repository/session.repository.module';

@Module({
  controllers: [],
  providers: [SessionService],
  exports: [SessionService],
  imports: [SessionRepositoryModule],
})
export class SessionModule {}
