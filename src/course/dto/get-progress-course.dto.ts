import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class GetProgressCourseDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    course_slug: string;
}