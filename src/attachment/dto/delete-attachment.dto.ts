import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class DeleteAttachmentDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    lesson_token: string;

    @IsString()
    @IsNotEmpty()
    attachId: string;
}