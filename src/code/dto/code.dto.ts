import { TestCase } from "@prisma/client";
import { IsEmail, IsNotEmpty, IsNumber, IsObject, IsString } from "class-validator";

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
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    code: string;

    @IsNotEmpty()
    @IsNumber()
    language_id: number;

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
    @IsString()
    next_content_token: string;
}

export interface HandleCodeProp {
    lab: string; 
    functionName: string; 
    code: string;
    testcaseInput: TestCase[];
    language_id: number;
}

export interface CheckStatusDto {
    token: string,
    testcase: TestCase[];
    contentId: string;
    courseId: string;
    userId: string;
    next_content_token: string;
}