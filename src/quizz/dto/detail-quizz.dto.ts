import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class DetailQuizzDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    exercise_token: string;

    @IsString()
    @IsNotEmpty()
    quiz_token: string;

    @IsString()
    @IsNotEmpty()
    course_slug: string;

    @IsString()
    @IsNotEmpty()
    chapter_token: string;
}
