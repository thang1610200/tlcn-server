import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CheckInviteCodeDto {

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    inviteCode: string;
}