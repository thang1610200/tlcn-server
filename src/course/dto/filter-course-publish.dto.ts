import { IsArray, IsString } from 'class-validator';

export interface FilterCourseDto {
    topic_slug?: string[] | string;
    title?: string;
    level_slug?: string[] | string;
    page?: string;
    duration?: string[] | string;
}
