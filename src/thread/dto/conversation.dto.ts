import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateConversationDto {
    @IsEmail()
    @IsNotEmpty()
    emailOwner: string;

    @IsString()
    @IsNotEmpty()
    memberTokenGuest: string;

    @IsString()
    @IsNotEmpty()
    serverToken: string;
}