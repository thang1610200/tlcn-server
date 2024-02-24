import { IsNotEmpty, IsString } from "class-validator";

export class GenerateInviteCodeDto {
    @IsString()
    @IsNotEmpty()
    serverToken: string;

    @IsString()
    @IsNotEmpty()
    email: string;
}