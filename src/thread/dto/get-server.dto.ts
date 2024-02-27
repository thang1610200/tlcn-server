import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class GetServerDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;
}

export class LeaveServerDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    serverToken: string;
}