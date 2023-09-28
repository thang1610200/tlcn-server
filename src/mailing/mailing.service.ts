import { Injectable } from '@nestjs/common';
import { MailingServiceInterface } from './interfaces/mailing.service.interface';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { UserResetPassword } from 'src/auth/events/user-reset-password.event';
import { UserRegister } from 'src/auth/events/user-register.event';

@Injectable()
export class MailingService implements MailingServiceInterface {

    constructor(@InjectQueue('emailSending') private readonly emailQueue: Queue) {}

    async sendRegisterEmail(payload: UserRegister): Promise<object> {
        const job = await this.emailQueue.add('register', { payload });
    
        return { jobId: job.id };
    }

    async sendResetPasswordEmail(data: UserResetPassword): Promise<object> {
        const job = await this.emailQueue.add('reset-password', { data });
    
        return { jobId: job.id };
    }

    
}
