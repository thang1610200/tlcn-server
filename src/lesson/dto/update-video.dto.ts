export interface UpdateVideoLesson {
    email: string;
    course_slug: string;
    chapter_token: string;
    lesson_token: string;
    file: any;
    duration: number;
}
