import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { UserResetPassword } from 'src/auth/events/user-reset-password.event';
import { InternalServerErrorException } from '@nestjs/common';
import { UserRegister } from 'src/auth/events/user-register.event';
import { UpdateRoleUserSuccess } from 'src/register-instructor/events/update-role-success.event';

@Processor('emailSending')
export class EmailProcessor {
    constructor(
        private readonly configService: ConfigService,
        private readonly mailerService: MailerService,
    ) {}

    @Process('reset-password')
    async sendEmail(job: Job<UserResetPassword>): Promise<void> {
        const payload: any = job.data;
        try {
            await this.mailerService.sendMail({
                to: payload.data.email,
                from: '"No Reply" <noreply@example.com>',
                subject: 'Reset Password',
                template: 'reset_password',
                context: {
                    url: `${this.configService.get(
                        'CLIENT_URL',
                    )}/reset-password?token=${payload.data.url}&email=${
                        payload.data.email
                    }`,
                    name: payload.data.name,
                },
            });
        } catch (err: any) {
            throw new InternalServerErrorException();
        }
    }

    @Process('register')
    async sendEmailRegister(job: Job<UserRegister>): Promise<void> {
        const payload: any = job.data;
        try {
            await this.mailerService.sendMail({
                to: payload.data.email,
                from: '"No Reply" <noreply@example.com>',
                subject: 'Chào mừng bạn đến với LEARNER - Trang web học trực tuyến hàng đầu!',
                template: 'verify',
                context: {
                    email: payload.data.email,
                    name: payload.data.name,
                    url: `${this.configService.get(
                        'CLIENT_URL',
                    )}/login`,
                },
            });
        } catch (err: any) {
            throw new InternalServerErrorException();
        }
    }

    @Process('update-role-success')
    async sendEmailUpdateRoleSuccess(job: Job<UpdateRoleUserSuccess>): Promise<void> {
        const payload: any = job.data;
        try {
            await this.mailerService.sendMail({
                to: payload.data.email,
                from: '"No Reply" <noreply@example.com>',
                subject: 'Xác nhận cập nhật quyền Instructor trên hệ thống',
                template: 'reply_success',
                context: {
                    email: payload.data.email,
                    name: payload.data.name,
                    url: `${this.configService.get(
                        'CLIENT_URL',
                    )}/api/auth/signout`
                },
            });
        } catch (err: any) {
            throw new InternalServerErrorException();
        }
    }

    @Process('update-role-reject')
    async sendEmailUpdateRoleReject(job: Job<UpdateRoleUserSuccess>): Promise<void> {
        const payload: any = job.data;
        try {
            await this.mailerService.sendMail({
                to: payload.data.email,
                from: '"No Reply" <noreply@example.com>',
                subject: 'Cập nhật quyền Instructor thất bại',
                template: 'reply_reject',
                context: {
                    email: payload.data.email,
                    name: payload.data.name,
                    reply: payload.data.reply
                },
            });
        } catch (err: any) {
            throw new InternalServerErrorException();
        }
    }
}
