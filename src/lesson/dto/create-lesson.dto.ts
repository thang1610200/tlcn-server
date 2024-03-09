import { ContentType } from '@prisma/client';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateLessonDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    course_slug: string;

    @IsString()
    @IsNotEmpty()
    chapter_token: string;

    @IsString()
    @IsEmail()
    email: string;

    @IsEnum(ContentType)
    @IsNotEmpty()
    type: ContentType
}
