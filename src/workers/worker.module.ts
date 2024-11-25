import { Module } from '@nestjs/common';
import { EmailRegisterProcessor } from '../modules/users/processors/email-register.processor';
import { MailerModule } from '../common/mailer/mailer.module';

@Module({
  imports: [MailerModule],
  providers: [EmailRegisterProcessor],
})
export class WorkerModule {}
