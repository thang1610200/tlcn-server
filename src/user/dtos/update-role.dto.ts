import { Role } from "@prisma/client";
import { IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator";

export class UpdateRoleDto {
    @IsString()
    @IsNotEmpty()
    email: string;

    @IsEnum(Role)
    role: Role;
}