import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateQuizzDto {
    @IsString()
    @IsNotEmpty()
    question: string;

    @IsString()
    @IsNotEmpty()
    exercise_token: string;

    @IsString()
    @IsNotEmpty()
    course_slug: string;

    @IsString()
    @IsNotEmpty()
    chapter_token: string;

    @IsEmail()
    email: string;
}
