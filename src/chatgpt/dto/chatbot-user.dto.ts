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