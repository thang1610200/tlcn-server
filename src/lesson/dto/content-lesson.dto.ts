import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class ContentLessonDto {
    @IsString()
    @IsNotEmpty()
    course_slug: string;

    @IsString()
    @IsNotEmpty()
    lesson_token: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;
}