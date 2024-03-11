import { IsEmail, IsNotEmpty, IsObject, IsString } from 'class-validator';

export class UpdateExerciseDto {
    @IsEmail()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsString()
    token: string;

    @IsNotEmpty()
    @IsString()
    course_slug: string;

    @IsNotEmpty()
    @IsString()
    chapter_token: string;

    @IsObject()
    value: object;
}
