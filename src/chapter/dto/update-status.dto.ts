import { IsBoolean, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class UpdateStatusChapterDto {

    @IsString()
    @IsNotEmpty()
    course_slug: string;

    @IsString()
    @IsNotEmpty()
    token: string;

    @IsString()
    @IsEmail()
    email: string;

    @IsBoolean()
    status: boolean;
}