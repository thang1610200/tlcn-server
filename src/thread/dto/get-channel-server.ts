import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class GetChannelServerDto {
    @IsString()
    serverToken: string;
}