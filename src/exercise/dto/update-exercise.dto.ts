import { IsEmail, IsNotEmpty, IsObject, IsString } from 'class-validator';

export class UpdateExerciseDto {
    @IsEmail()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsString()
    token: string;

    @IsObject()
    value: object;
}
