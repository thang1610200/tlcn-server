import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class UpdatePasswordDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    currentPassword: string;
}