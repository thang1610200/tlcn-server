import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class createMessageChannelDto {
    @IsString()
    @IsNotEmpty()
    channelToken: string;

    @IsString()
    @IsNotEmpty()
    serverToken: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsString()
    @IsNotEmpty()
    email: string;
}

export class UploadFileChannelDto {
    @IsString()
    @IsNotEmpty()
    channelToken: string;

    @IsString()
    @IsNotEmpty()
    serverToken: string;

    @IsString()
    @IsNotEmpty()
    email: string;
}

export interface UploadFileChannelInterface {
    channelToken: string;
    serverToken: string;
    email: string;
    file: any;
} 

export class PaginationMessageDto {
    @IsString()
    @IsNotEmpty()
    channelToken: string;

    @IsOptional()
    cursor: string;
}