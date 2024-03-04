import { IsNotEmpty, IsString } from "class-validator";

export class CreateMediaRoomDto {
    @IsString()
    @IsNotEmpty()
    room: string;

    @IsString()
    @IsNotEmpty()
    username: string
}