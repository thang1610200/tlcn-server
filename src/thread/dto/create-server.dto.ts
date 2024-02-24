import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateServerDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;
}