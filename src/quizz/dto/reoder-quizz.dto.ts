import { IsArray, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ReorderQuizzDto {
    @IsArray()
    list: {
        token: string;
        position: number;
    }[];
}
