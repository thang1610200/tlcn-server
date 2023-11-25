import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class GetUserProgressQuizDto {
    @IsString()
    @IsNotEmpty()
    id: string;
}
