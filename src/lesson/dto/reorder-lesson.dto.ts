import { IsArray } from "class-validator";

export class ReorderLessonDto {
    @IsArray()
    list: {
        id: string,
        position: number
    }[];
}