import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class KickMemberDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    serverToken: string;

    @IsEmail()
    @IsNotEmpty()
    emailMember: string;
}