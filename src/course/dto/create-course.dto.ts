import { IsNotEmpty, IsString } from "class-validator";

export class CreateCourseDto {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    description: string;

    @IsString()
    @IsNotEmpty()
    learning_outcome: string;

    @IsString()
    picture: string;
}