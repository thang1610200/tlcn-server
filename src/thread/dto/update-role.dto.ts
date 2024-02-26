import { MemberRole } from "@prisma/client";
import { IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator";

export class UpdateRoleMemberDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    serverToken: string;

    @IsEnum(MemberRole)
    @IsNotEmpty()
    role: MemberRole;

    @IsEmail()
    @IsNotEmpty()
    emailMember: string;
}