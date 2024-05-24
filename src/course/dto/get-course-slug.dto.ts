import { IsNotEmpty, IsString } from 'class-validator';

export class GetCourseBySlugDto {
    @IsString()
    @IsNotEmpty()
    slug: string;

    @IsString()
    @IsNotEmpty()
    email: string;
}

export class FindCourseByAi {
    @IsString()
    @IsNotEmpty()
    request: string;
}
