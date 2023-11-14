import { IsArray, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class ReorderQuizzDto {
    @IsString()
    @IsNotEmpty()
    exercise_token: string;

    @IsString()
    @IsEmail()
    email: string;

    @IsArray()
    list: {
        token: string,
        position: number
    }[];
}