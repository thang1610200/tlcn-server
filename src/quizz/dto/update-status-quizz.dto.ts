import { IsBoolean, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class UpdateStatusQuizzDto {

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    token: string;

    @IsString()
    @IsNotEmpty()
    exercise_token: string;

    @IsBoolean()
    status: boolean;
}