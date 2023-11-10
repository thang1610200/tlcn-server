export interface CourseResponse {
    title: string;
    description: string;
    learning_outcome: string[];
    requirement: string[];
    slug: string;
    picture: string;
    isPublished: boolean;
    create_at: Date;
}