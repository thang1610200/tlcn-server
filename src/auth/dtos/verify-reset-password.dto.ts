import { IsEmail, IsString } from 'class-validator';

export class VerifyResetPasswordDto {
    @IsString()
    email: string;

    @IsString()
    token: string;
}
