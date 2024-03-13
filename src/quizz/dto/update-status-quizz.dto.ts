import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UpdateStatusQuizzDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    course_slug: string;

    @IsString()
    @IsNotEmpty()
    chapter_token: string;

    @IsString()
    @IsNotEmpty()
    quiz_token: string;

    @IsString()
    @IsNotEmpty()
    exercise_token: string;

    @IsBoolean()
    status: boolean;
}
