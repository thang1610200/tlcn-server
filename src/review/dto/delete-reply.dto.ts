import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class DeleteReplyDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    replyId: string;

    @IsString()
    @IsNotEmpty()
    reviewId: string;
}