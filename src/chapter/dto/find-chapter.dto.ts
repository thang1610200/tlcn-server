import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class FindChapterDto {
    
    @IsString()
    @IsNotEmpty()
    course_slug: string;

    @IsString()
    @IsNotEmpty()
    token: string;

    @IsString()
    @IsEmail()
    email: string;
}