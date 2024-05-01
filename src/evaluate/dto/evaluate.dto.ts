import { LanguageType } from "@prisma/client";
import { IsArray, IsEmail, IsEnum, IsNotEmpty, IsObject, IsString } from "class-validator";

export interface EvaluateCode {
    lang: string;
    testFile: string;
    testFileName: string;
    code: {
        codeFile: string;
        codeFileName: string;
    }[]
}

export class PreviewCodeDto {
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

    @IsNotEmpty()
    @IsArray()
    codeFile: string[];
}