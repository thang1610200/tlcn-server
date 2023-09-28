import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class NewUserDto {
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    image: string;
}

