import { IsEmail, IsNotEmpty, IsObject, IsString } from "class-validator";

export class UpdateLessonDto {
    @IsString()
    @IsNotEmpty()
    course_slug: string;

    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    chapter_token: string;

    @IsString()
    @IsNotEmpty()
    lesson_token: string;

    @IsObject()
    value: object
}