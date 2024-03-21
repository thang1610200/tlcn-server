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

export class AddAnswerUserProgressDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    quiz_token: string;

    @IsString()
    @IsNotEmpty()
    answer: string;

    @IsString()
    @IsNotEmpty()
    user_progress_id: string;

    @IsString()
    @IsNotEmpty()
    exercise_token: string;

    @IsString()
    @IsNotEmpty()
    next_content_token: string;

    @IsString()
    @IsNotEmpty()
    course_slug: string;

    @IsBoolean()
    @IsNotEmpty()
    last_quiz: boolean;
}

export class RetakeQuizDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    user_progress_id: string;

    @IsString()
    @IsNotEmpty()
    course_slug: string;

    @IsString()
    @IsNotEmpty()
    content_token: string;
}

