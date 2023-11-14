import { TypeExercise } from "@prisma/client";
import { IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator";

export class CreateExerciseDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsEnum(TypeExercise)
    @IsNotEmpty()
    type: TypeExercise;

    @IsEmail()
    @IsNotEmpty()
    email: string;
}