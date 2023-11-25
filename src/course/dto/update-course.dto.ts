import { IsEmail, IsNotEmpty, IsObject, IsString } from 'class-validator';

export class UpdateValueCourse {
    @IsString()
    @IsNotEmpty()
    slug: string;

    @IsObject()
    value: object;

    @IsString()
    @IsEmail()
    email: string;
}
