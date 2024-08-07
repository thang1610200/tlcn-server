import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateQuizzDto {
    @IsNotEmpty()
    @IsString()
    question: string;

    @IsNotEmpty()
    @IsString()
    exercise_token: string;

    @IsNotEmpty()
    @IsString()
    course_slug: string;

    @IsNotEmpty()
    @IsString()
    chapter_token: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;
}
