import { IsString } from "class-validator";

export class FilterCourseDto {
    @IsString()
    topic_slug: string;

    @IsString()
    title: string;
}