import { Course, Topic } from "@prisma/client";
import { CreateTopicDto } from "../dto/create-topic.dto";
import { CreateCourseDto } from "../dto/create-course.dto";

export interface CourseServiceInterface {
    slugify(string, separator): string;
    findByTitleTopic(payload: string): Promise<Topic>;
    createTopic(payload: CreateTopicDto): Promise<Topic>;
    createCourse (payload: CreateCourseDto, user: object): Promise<Course>;
    findByNameCourse(payload: string): Promise<Course>;
}