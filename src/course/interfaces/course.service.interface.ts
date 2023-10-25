import { Course, Topic } from "@prisma/client";
import { CreateTopicDto } from "../dto/create-topic.dto";
import { CreateCourseDto } from "../dto/create-course.dto";

export interface CourseServiceInterface {
    findByTitleTopic(payload: string): Promise<Topic>;
    createTopic(payload: CreateTopicDto): Promise<Topic>;
    createCourse (payload: CreateCourseDto): Promise<Course>;
    findByNameCourse(payload: string): Promise<Course>;
}