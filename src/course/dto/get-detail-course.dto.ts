import { IsString } from 'class-validator';

export class GetDetailCourseDto {
    @IsString()
    slug: string;
}
