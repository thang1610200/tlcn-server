import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class DeleteReviewDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    reviewId: string;
}