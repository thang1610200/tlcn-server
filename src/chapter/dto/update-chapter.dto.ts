import { IsEmail, IsNotEmpty, IsObject, IsString } from "class-validator";

export class UpdateValueChapterDto {

    @IsString()
    @IsNotEmpty()
    course_slug: string;

    @IsString()
    @IsNotEmpty()
    token: string;

    @IsString()
    @IsEmail()
    email: string;

    @IsObject()
    value: object;
}