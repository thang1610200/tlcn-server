import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AddUserProgressDto {
    @IsString()
    @IsNotEmpty()
    course_slug: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;
}
