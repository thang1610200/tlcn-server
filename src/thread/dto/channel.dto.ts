import { ChannelType } from "@prisma/client";
import { IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator";

export class CreateChannelDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    serverToken: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEnum(ChannelType)
    type: ChannelType 
}

export class EditChannelDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    serverToken: string;

    @IsString()
    @IsNotEmpty()
    channelToken: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEnum(ChannelType)
    type: ChannelType 
}

export class DeleteChannelDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    serverToken: string;

    @IsString()
    @IsNotEmpty()
    channelToken: string;
}

export class AccessChannelGeneralDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    serverToken: string;
}

export interface ChannelResponse {
    token: string;
    name: string;
    type: ChannelType;
}

export class DetailChannelDto {
    @IsString()
    @IsNotEmpty()
    channelToken: string;
}