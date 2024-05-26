import { InputContent } from "@google/generative-ai";
import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class ChatbotUserDto {
    @IsString()
    @IsNotEmpty()
    request: string;

    @IsArray()
    history: InputContent[];
}