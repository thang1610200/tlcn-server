import { ContentType, TypeExercise } from '@prisma/client';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateExerciseDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsEnum(TypeExercise)
    @IsNotEmpty()
    typeExercise: TypeExercise;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    course_slug: string;

    @IsString()
    @IsNotEmpty()
    chapter_token: string;

    @IsEnum(ContentType)
    @IsNotEmpty()
    typeContent: ContentType;
}
