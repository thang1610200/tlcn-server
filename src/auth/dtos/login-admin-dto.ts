import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginAdminDto {
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}
