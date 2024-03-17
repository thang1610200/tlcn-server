import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AddUserProgressDto {
    @IsString()
    @IsNotEmpty()
    course_slug: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;
}

export class CompleteLessonDto {
    @IsString()
    @IsNotEmpty()
    course_slug: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    content_token: string;

    @IsOptional()
    next_content_token: string;
}

