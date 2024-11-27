import { Module } from '@nestjs/common';
import { KafkaAdminService } from './services/kafka.admin.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [KafkaAdminService],
  exports: [KafkaAdminService],
  controllers: [],
  imports: [ConfigModule],
})
export class KafkaAdminModule {}
