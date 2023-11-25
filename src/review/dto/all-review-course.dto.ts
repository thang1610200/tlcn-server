import { IsNotEmpty, IsString } from "class-validator";

export class AllReviewCourseDto {
    @IsString()
    @IsNotEmpty()
    course_slug: string;
}