import { StatusRegisterInstructor } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";

export class UpdateStatusRegisterInstructorDto {
    @IsString()
    @IsNotEmpty()
    token: string;

    @IsEnum(StatusRegisterInstructor)
    status: StatusRegisterInstructor;

    @IsString()
    reply: string;
}