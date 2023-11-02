import { IsString } from "class-validator";

export class GetCourseUserDto {
    @IsString()
    email: string;
}