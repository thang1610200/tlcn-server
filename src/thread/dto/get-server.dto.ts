import { IsEmail, IsNotEmpty } from "class-validator";

export class GetServerDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;
}