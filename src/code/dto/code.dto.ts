import { IsEmail, IsNotEmpty, IsObject, IsString } from "class-validator";

export class AddQuestionCodeDto {
    @IsNotEmpty()
    @IsString()
    question: string;

    @IsNotEmpty()
    @IsString()
    exercise_token: string;

    @IsNotEmpty()
    @IsString()
    course_slug: string;

    @IsNotEmpty()
    @IsString()
    chapter_token: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;
}

export class GetDetailCodeDto {
    @IsNotEmpty()
    @IsString()
    code_token: string;

    @IsNotEmpty()
    @IsString()
    exercise_token: string;

    @IsNotEmpty()
    @IsString()
    course_slug: string;

    @IsNotEmpty()
    @IsString()
    chapter_token: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;
}

export class UpdateValueCodeDto {
    @IsObject()
    value: object;

    @IsNotEmpty()
    @IsString()
    code_token: string;

    @IsNotEmpty()
    @IsString()
    exercise_token: string;

    @IsNotEmpty()
    @IsString()
    course_slug: string;

    @IsNotEmpty()
    @IsString()
    chapter_token: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;
}

export class GetAllLanguageCodeDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;
}