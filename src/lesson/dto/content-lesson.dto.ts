import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ContentLessonDto {
    @IsString()
    @IsNotEmpty()
    course_slug: string;

    @IsString()
    @IsNotEmpty()
    content_token: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;
}

export class SummarizationVideoDto {
    @IsNotEmpty()
    @IsString()
    content_token: string;

    @IsNotEmpty()
    @IsString()
    course_slug: string;
}
