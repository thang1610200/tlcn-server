import { UserRegister } from "src/auth/queues/user-register.queue";
import { UserResetPassword } from "src/auth/queues/user-reset-password.queue";


export interface MailingServiceInterface {
    sendResetPasswordEmail(payload: UserResetPassword): Promise<object>;
    sendRegisterEmail(payload: UserRegister): Promise<object>;
}