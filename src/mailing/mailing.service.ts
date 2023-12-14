import { Injectable } from '@nestjs/common';
import { MailingServiceInterface } from './interfaces/mailing.service.interface';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { UserResetPassword } from 'src/auth/events/user-reset-password.event';
import { UserRegister } from 'src/auth/events/user-register.event';
import { UpdateRoleUserSuccess } from 'src/register-instructor/events/update-role-success.event';

@Injectable()
export class MailingService implements MailingServiceInterface {
    constructor(
        @InjectQueue('emailSending') private readonly emailQueue: Queue,
    ) {}

    async sendRegisterEmail(data: UserRegister): Promise<object> {
        const job = await this.emailQueue.add('register', { data });

        return { jobId: job.id };
    }

    async sendResetPasswordEmail(data: UserResetPassword): Promise<object> {
        const job = await this.emailQueue.add(
            'reset-password',
            { data },
            {
                backoff: {
                    type: 'exponential',
                    delay: 2000,
                },
            },
        );

        return { jobId: job.id };
    }

    async sendUpdateRoleSuccess(data: UpdateRoleUserSuccess): Promise<object> {
        const job = await this.emailQueue.add(
            'update-role-success',
            { data },
            {
                backoff: {
                    type: 'exponential',
                    delay: 2000,
                },
            },
        );

        return { jobId: job.id };
    }

    async sendUpdateRoleReject(data: UpdateRoleUserSuccess): Promise<object> {
        const job = await this.emailQueue.add(
            'update-role-reject',
            { data },
            {
                backoff: {
                    type: 'exponential',
                    delay: 2000,
                },
            },
        );

        return { jobId: job.id };
    }
}
