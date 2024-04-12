import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class AddTestCaseDto {
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
    input: string;

    @IsNotEmpty()
    @IsString()
    output: string;
}

export class DeleteTestCaseDto {
    @IsNotEmpty()
    @IsString()
    codeId: string;

    @IsNotEmpty()
    @IsString()
    testcaseId: string;
}