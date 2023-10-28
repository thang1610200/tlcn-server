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

    slugify(name: string, separator: string = '-'): string {
        return name
                .toString()
                .toLowerCase()
                .trim()
                .replace(/\s+/g, separator)
                .replace(/[^\w\-]+/g, '')
                .replace(/\_/g, separator)
                .replace(/\-\-+/g, separator)
                .replace(/\-$/g, ''); 
    }

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

    async createCourse (payload: CreateCourseDto, user: any): Promise<Course> {
        const course = await this.findByNameCourse(payload.title);

        if(course){
            throw new UnprocessableEntityException();
        }

        const users = await this.prismaService.user.findUnique({
            where: {
                email: user.email
            }
        })

        return await this.prismaService.course.create({
            data: {
                title: payload.title,
                owner_id: users.id,
                slug: this.slugify(payload.title)
            }
        });
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
                title: payload
            } 
        });
    }
}
