import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionRepository } from './repositories/session.repository';
import { SessionEntity } from './entities/session.entity';

@Module({
  providers: [SessionRepository],
  exports: [SessionRepository],
  controllers: [],
  imports: [TypeOrmModule.forFeature([SessionEntity])],
})
export class SessionRepositoryModule {}
