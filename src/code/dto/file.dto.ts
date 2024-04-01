import { LanguageType, MimeType } from "@prisma/client";
import { IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator";

export class AddFileNameDto {
    @IsNotEmpty()
    @IsString()
    fileName: string;

    @IsNotEmpty()
    @IsEnum(LanguageType)
    languageCode: LanguageType;

    @IsNotEmpty()
    @IsEnum(MimeType)
    mimeFile: MimeType;

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

export class UpdateContentFileDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

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
    @IsString()
    fileId: string;

    @IsString()
    content: string;
}