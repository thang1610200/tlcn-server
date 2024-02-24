import { IsNotEmpty, IsString, IsEmail } from "class-validator";

export class UpdateServerDto {
    @IsString()
    @IsNotEmpty()
    serverToken: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;
}