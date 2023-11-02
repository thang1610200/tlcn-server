import { IsBoolean, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class UpdateStatusDto {

    @IsString()
    @IsNotEmpty()
    slug: string;

    @IsString()
    @IsEmail()
    email: string;

    @IsBoolean()
    status: boolean;
}