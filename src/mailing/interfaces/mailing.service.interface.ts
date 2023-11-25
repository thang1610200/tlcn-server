import { UserRegister } from 'src/auth/events/user-register.event';
import { UserResetPassword } from 'src/auth/events/user-reset-password.event';

export interface MailingServiceInterface {
    sendResetPasswordEmail(payload: UserResetPassword): Promise<object>;
    sendRegisterEmail(payload: UserRegister): Promise<object>;
}
