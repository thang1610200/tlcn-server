import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateChapterDto {
    @IsString()
    @IsNotEmpty()
    slug: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;
}