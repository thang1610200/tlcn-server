import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class AddReplyDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    reviewId: string;

    @IsString()
    @IsNotEmpty()
    reply: string;
}