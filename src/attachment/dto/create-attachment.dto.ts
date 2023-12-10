import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateAttachmentDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    lesson_token: string;
}