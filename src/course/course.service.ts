import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CourseServiceInterface } from './interfaces/course.service.interface';
import { CreateTopicDto } from './dto/create-topic.dto';
import { Course, Topic } from '@prisma/client';
import { CreateCourseDto } from './dto/create-course.dto';
import { UploadService } from 'src/upload/upload.service';

@Injectable()
export class CourseService implements CourseServiceInterface {
    constructor (private readonly prismaService: PrismaService) {}

    async createTopic(payload: CreateTopicDto): Promise<Topic> {
        const topic = await this.findByTitleTopic(payload.title);

        if(topic){
            throw new UnprocessableEntityException();
        }

        const newTopic = await this.prismaService.topic.create({
            data: {
                title: payload.title
            }
        })

        return newTopic;
    }

    async createCourse (payload: CreateCourseDto): Promise<Course> {
        const course = await this.findByNameCourse(payload.name);

        if(course){
            throw new UnprocessableEntityException();
        }

        return course;
        
    }

    async findByTitleTopic(payload: string): Promise<Topic> {
        return await this.prismaService.topic.findUnique({
            where: {
                title: payload
            }
        });
    }

    async findByNameCourse(payload: string): Promise<Course> {
        return await this.prismaService.course.findUnique({
            where: {
                name: payload
            } 
        });
    }
}
