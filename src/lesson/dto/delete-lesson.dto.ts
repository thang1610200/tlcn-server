import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class DeleteLessonDto {
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
}
