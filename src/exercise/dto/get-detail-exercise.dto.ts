import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class GetDetailExerciseDto {
    @IsString()
    @IsNotEmpty()
    token: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    course_slug: string;

    @IsString()
    @IsNotEmpty()
    chapter_token: string;
}
