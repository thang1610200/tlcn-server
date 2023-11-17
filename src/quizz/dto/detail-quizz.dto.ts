import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class DetailQuizzDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    exercise_token: string;

    @IsString()
    @IsNotEmpty()
    token: string;
}