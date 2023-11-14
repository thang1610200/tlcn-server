import { JsonValue } from "@prisma/client/runtime/library";

export interface QuizzResponse {
    token: string;
    question: string;
    answer: string;
    option: JsonValue;
    position: number;
    isPublished: boolean;
}