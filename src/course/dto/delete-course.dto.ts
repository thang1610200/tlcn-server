import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class DeleteCourseDto {

    @IsString()
    @IsNotEmpty()
    slug: string;

    @IsString()
    @IsEmail()
    email: string
}