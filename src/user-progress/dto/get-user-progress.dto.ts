import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class GetUserProgressDto {
    @IsString()
    @IsNotEmpty()
    lesson_token: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;
}
