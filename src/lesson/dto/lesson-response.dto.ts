export interface LessonResponse {
    title: string;
    token: string;
    description: string;
    position: number;
    isPublished: boolean;
    videoUrl: string;
    isCompleteVideo: boolean;
    thumbnail: string;
    exerciseId: string;
    //course_title: string
}