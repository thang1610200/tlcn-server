import { IsEmail } from "class-validator";

export class UpdateAvatarRequestDto {

    @IsEmail()
    email: string;
}