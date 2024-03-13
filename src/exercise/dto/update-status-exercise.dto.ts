import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UpdateStatusExerciseDto {
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

    @IsBoolean()
    status: boolean;
}
