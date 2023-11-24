import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class AddExerciseLessonDto {
    @IsString()
    @IsNotEmpty()
    lesson_token: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    exerciseId: string;

    @IsString()
    @IsNotEmpty()
    course_slug: string;

    @IsString()
    @IsNotEmpty()
    chapter_token: string;
}