import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginSocialDto {
    @IsEmail()
    email: string;

    @IsString()
    name: string;

    @IsString()
    image: string;
}

