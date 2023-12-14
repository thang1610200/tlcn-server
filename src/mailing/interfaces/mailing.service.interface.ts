import { UserRegister } from 'src/auth/events/user-register.event';
import { UserResetPassword } from 'src/auth/events/user-reset-password.event';
import { UpdateRoleUserSuccess } from 'src/register-instructor/events/update-role-success.event';

export interface MailingServiceInterface {
    sendResetPasswordEmail(payload: UserResetPassword): Promise<object>;
    sendRegisterEmail(payload: UserRegister): Promise<object>;
    sendUpdateRoleSuccess(data: UpdateRoleUserSuccess): Promise<object>;
    sendUpdateRoleReject(data: UpdateRoleUserSuccess): Promise<object>;
}
