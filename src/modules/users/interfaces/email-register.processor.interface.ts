import { EmailSendDto } from '../../../common/mailer/dtos/email.send.dto';

export interface IEmailRegisterProcessor {
  processRegister(data: EmailSendDto): Promise<void>;
}
