import { IsNotEmpty, IsString } from "class-validator";

export class DetailRegisterInstructorDto {
    @IsString()
    @IsNotEmpty()
    token: string;
}