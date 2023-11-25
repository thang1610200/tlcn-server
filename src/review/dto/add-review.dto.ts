import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class AddReviewDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    course_slug: string;

    @IsString()
    @IsNotEmpty()
    content: string;
}