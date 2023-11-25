import { IsNotEmpty, IsString } from 'class-validator';

export class GetAllExerciseDto {
    @IsString()
    @IsNotEmpty()
    email: string;
}
