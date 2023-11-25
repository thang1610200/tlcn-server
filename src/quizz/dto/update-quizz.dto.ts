import { IsEmail, IsNotEmpty, IsObject, IsString } from 'class-validator';

export class UpdateQuizzDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    token: string;

    @IsString()
    @IsNotEmpty()
    exercise_token: string;

    @IsObject()
    value: object;
}
