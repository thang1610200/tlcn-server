import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class AddSubtitleLessonDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;
    
    @IsString()
    @IsNotEmpty()
    lesson_token: string;

    @IsString()
    @IsNotEmpty()
    course_slug: string;

    @IsString()
    @IsNotEmpty()
    chapter_token: string;

    @IsString()
    @IsNotEmpty()
    language: string;

    @IsString()
    @IsNotEmpty()
    language_code: string;
}

export class DeleteSubtitleLessonDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;
    
    @IsString()
    @IsNotEmpty()
    lesson_token: string;

    @IsString()
    @IsNotEmpty()
    course_slug: string;

    @IsString()
    @IsNotEmpty()
    chapter_token: string;

    @IsString()
    @IsNotEmpty()
    subtitleId: string
}

export class TranslateSubtitleDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;
    
    @IsString()
    @IsNotEmpty()
    lesson_token: string;

    @IsString()
    @IsNotEmpty()
    course_slug: string;

    @IsString()
    @IsNotEmpty()
    chapter_token: string;

    @IsString()
    @IsNotEmpty()
    language: string;

    @IsString()
    @IsNotEmpty()
    language_code: string;

    @IsString()
    @IsNotEmpty()
    subtitleId: string
}

export interface AddSubtitleLessonInterface {
    email: string;
    lesson_token: string;
    course_slug: string;
    chapter_token: string;
    language: string;
    language_code: string;
    file: any;
}

export interface TranslateSubtitleQueue {
    lessonId: string;
    subtitleUrl: string;
    language: string;
    language_code: string;
}