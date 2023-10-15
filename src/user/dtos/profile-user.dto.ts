import { IsEmail } from "class-validator";


export class Profile {
    @IsEmail()
    email: string;
}