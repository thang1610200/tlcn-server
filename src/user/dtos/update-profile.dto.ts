import { IsArray, IsEmail, IsEmpty, IsString } from "class-validator";

export class UpdateProfile {
    @IsEmail()
    email: string;

    @IsString()
    username: string;

    @IsString()
    bio: string;

    @IsArray()
    url: string[];
}