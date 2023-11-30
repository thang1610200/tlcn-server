import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UpdateProgressExerciseDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    lesson_next: string;

    @IsString()
    @IsNotEmpty()
    lessontoken: string;

    @IsString()
    @IsNotEmpty()
    course_slug: string;
}
