import { IsEmail, IsNotEmpty } from "class-validator";

export class AddRegisterInstructorDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;
}