import { User, PasswordResetToken } from "@prisma/client";
import { NewUserDto } from "../dtos/new-user.dto";
import { UserResponse } from "../dtos/new-user-response.dto";
import { LoginUserDto } from "../dtos/login-user.dto";
import { LoginSocialDto } from "../dtos/login-social.dto";
import { ResetPasswordDto } from "../dtos/reset-password.dto";
import { UserResetPassword } from "../events/user-reset-password.event";
import { UserRegister } from "../events/user-register.event";
import { VerifyResetPasswordDto } from "../dtos/verify-reset-password.dto";
import { UpdatePasswordDto } from "../dtos/update-password.dto";

export interface AuthServiceInterface {
    findbyEmail (email: string): Promise<User>;
    hashPassword (password: string): Promise<string>;
    buildResponse (user: User): UserResponse;
    register (newUser: Readonly<NewUserDto>): Promise<UserResponse>;
    login (user: Readonly<LoginUserDto>): Promise<{
        user: UserResponse,
        backendTokens: object
    }>
    validateUser(email: string, password: string): Promise<UserResponse>;
    comparePassword(password: string, hashPass: string): Promise<boolean>;
    refreshToken(user: any): Promise<object>;
    loginSocial(user: LoginSocialDto): Promise<{
        user: UserResponse,
        backendTokens: object
    }>;
    createUrl(): string;
    resetPassword(dto: ResetPasswordDto): Promise<PasswordResetToken>;
    verifyTokenResetPassword(payload: VerifyResetPasswordDto): Promise<string>;
    updatePassword(payload: UpdatePasswordDto): Promise<UserResponse>;
    sendEmailWelcome(data: UserRegister): Promise<void>;
    sendEmailResetPassowrd(data: UserResetPassword): Promise<void>;
}