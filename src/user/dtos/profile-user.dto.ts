import { IsEmail, IsNotEmpty } from 'class-validator';

export class Profile {
    @IsNotEmpty()
    @IsEmail()
    email: string;
}
