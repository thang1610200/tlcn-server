import { IsArray, IsEmail, IsNotEmpty, IsNumber, IsObject, IsString, ValidateIf } from "class-validator";

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

export class SubmitCodeDto {
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
    content_token: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsArray()
    codeFile: string[];

    @ValidateIf((o, value) => typeof value === 'string' || typeof value === 'undefined' )
    next_content_token?: string;
}

export interface DetailCodeInterface {
    course_slug: string;
    content_token: string;
    exercise_token: string;
    code_token: string;
}