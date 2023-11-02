import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateLessonDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    course_slug: string;

    @IsString()
    @IsNotEmpty()
    chapter_token: string;

    @IsString()
    @IsEmail()
    email: string;
}