import { Injectable } from '@nestjs/common';
import { MailingServiceInterface } from './interfaces/mailing.service.interface';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { UserResetPassword } from 'src/auth/queues/user-reset-password.queue';
import { UserRegister } from 'src/auth/queues/user-register.queue';

@Injectable()
export class MailingService implements MailingServiceInterface {

    constructor(@InjectQueue('emailSending') private readonly emailQueue: Queue) {}

    async sendRegisterEmail(data: UserRegister): Promise<object> {
        const job = await this.emailQueue.add('register', { data });
    
        return { jobId: job.id };
    }

    async sendResetPasswordEmail(data: UserResetPassword): Promise<object> {
        const job = await this.emailQueue.add('reset-password', { data }, {
            backoff: {
                type: 'exponential',
                delay: 2000,
            }
        });
    
        return { jobId: job.id };
    }

    
}
