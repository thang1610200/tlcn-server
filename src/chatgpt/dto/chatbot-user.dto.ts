import { IsArray, IsNotEmpty, IsString } from "class-validator";

export interface HistoryInterface {
    label: string;
    value: string;
}

export class ChatbotUserDto {
    @IsString()
    @IsNotEmpty()
    request: string;

    @IsArray()
    history: HistoryInterface[];
}

export class SummaryCourseDto {
    @IsNotEmpty()
    @IsString()
    course_slug: string;
}

export class SupportCodeDto {
    @IsNotEmpty()
    @IsString()
    codeTitle: string;

    @IsNotEmpty()
    @IsString()
    codeLang: string;
}