import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export interface OutputFormat {
    [key: string]: string | string[] | OutputFormat;
}

export class CreateListQuizzDto {
    @IsString()
    @IsNotEmpty()
    topic: string;

    @IsNumber()
    @IsNotEmpty()
    amount: number;

    @IsString()
    @IsNotEmpty()
    type: string;

    @IsString()
    @IsNotEmpty()
    level: string;

    @IsString()
    @IsNotEmpty()
    exercise_token: string;

    @IsEmail()
    email: string;
}
