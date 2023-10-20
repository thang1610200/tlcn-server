import { IsArray, IsEmail, IsEmpty, IsString } from "class-validator";

export class UpdateProfile {
    @IsEmail()
    email: string;

    @IsString()
    username: string;

    @IsString()
    bio: string;

    @IsString()
    facebook_id: string

    @IsString()
    youtube_id: string

    @IsString()
    tiktok_id: string
}