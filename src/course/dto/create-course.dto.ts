import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCourseDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    email: string;
}
