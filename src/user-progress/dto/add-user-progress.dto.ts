import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AddUserProgressDto {
    @IsString()
    @IsNotEmpty()
    lesson_token: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsBoolean()
    isCompleted: boolean;
}
