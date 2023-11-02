import { IsArray, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class ReorderChapterDto {
    @IsString()
    @IsNotEmpty()
    courseSlug: string;

    @IsString()
    @IsEmail()
    email: string;

    @IsArray()
    list: {
        id: string,
        position: number
    }[];
}