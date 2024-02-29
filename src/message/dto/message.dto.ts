import { IsNotEmpty, IsString } from "class-validator";

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