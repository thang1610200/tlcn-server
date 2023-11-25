import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UpdateStatusExerciseDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    exercise_token: string;

    @IsBoolean()
    status: boolean;
}
