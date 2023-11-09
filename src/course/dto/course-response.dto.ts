export interface CourseResponse {
    title: string;
    description: string;
    learning_outcome: string[];
    slug: string;
    picture: string;
    isPublished: boolean;
    create_at: Date;
}