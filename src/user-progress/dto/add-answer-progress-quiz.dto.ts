import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AddAnswerUserProgressDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    lesson_token: string;

    @IsString()
    @IsNotEmpty()
    quizzId: string;

    @IsString()
    @IsNotEmpty()
    answer: string;

    @IsBoolean()
    @IsNotEmpty()
    isCorrect: boolean;
}
