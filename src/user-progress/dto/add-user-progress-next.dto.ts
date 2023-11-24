import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AddUserProgressNextDto {
    @IsString()
    @IsNotEmpty()
    lesson_token: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsBoolean()
    isCompleted: boolean;

    @IsString()
    @IsNotEmpty()
    lesson_next: string;
}
