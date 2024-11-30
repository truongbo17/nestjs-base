import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { ENUM_WORKER_QUEUES } from '../../../workers/enums/worker.enum';
import { EmailSendDto } from '../../../common/mailer/dtos/email.send.dto';
import { MailerService } from '../../../common/mailer/mailer.service';
import { EmailWorkerDto } from '../../../common/mailer/dtos/email.worker.dto';
import { IEmailRegisterProcessor } from '../interfaces/email-register.processor.interface';
import path from 'node:path';
import { ConfigService } from '@nestjs/config';
import { I18nLangService } from '../../../common/i18n/services/i18n-lang.service';

@Processor(ENUM_WORKER_QUEUES.EMAIL_REGISTER_QUEUE)
export class EmailRegisterProcessor
  extends WorkerHost
  implements IEmailRegisterProcessor
{
  private readonly logger: Logger = new Logger(EmailRegisterProcessor.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    private readonly i18nLangService: I18nLangService
  ) {
    super();
  }

  async process(job: Job<EmailWorkerDto>): Promise<void> {
    try {
      const jobName: string = job.name;
      const responseSendMail: void = await this.processRegister(job.data.send);

      this.logger.log(
        `Processing job ${jobName} with data: ${JSON.stringify(job)} with response: ${responseSendMail}`
      );
    } catch (error: any) {
      this.logger.error(error);
    }

    return;
  }

  async processRegister(data: EmailSendDto): Promise<void> {
    const appName = this.configService.get('app.name', { infer: true });
    const subject = this.i18nLangService.setMessage('user.titleRegister');

    return await this.mailerService.sendMail({
      to: data.email,
      subject: <string>subject,
      text: `${appName} ${subject}`,
      templatePath: path.join(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'templates',
        'email',
        'register.hbs'
      ),
      context: {
        name: data.name,
        email: data.email,
        appName: appName,
      },
    });
  }
}
