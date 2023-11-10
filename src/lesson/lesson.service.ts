import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { LessonServiceInterface } from './interfaces/lesson.service.interface';
import { PrismaService } from 'src/prisma.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { LessonResponse } from './dto/lesson-response.dto';
import { ReorderLessonDto } from './dto/reorder-lesson.dto';
import { GetLessonDto } from './dto/get-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { UpdateVideoLesson } from './dto/update-video.dto';
import { UploadService } from 'src/upload/upload.service';
import { UpdateStatusLessonDto } from './dto/update-status.dto';
import { DeleteLessonDto } from './dto/delete-lesson.dto';
import { Lesson } from '@prisma/client';
import { UpdateThumbnailVideo } from './dto/update-thumbnail.dto';

@Injectable()
export class LessonService implements LessonServiceInterface {
    constructor (private readonly prismaService: PrismaService,
                private readonly uploadService: UploadService){}

    async createLesson(payload: CreateLessonDto): Promise<LessonResponse> {
        const user = await this.prismaService.user.findUnique({
            where: {
                email: payload.email
            }
        });

        const course = await this.prismaService.course.findFirst({
            where: {
                owner_id: user.id,
                slug: payload.course_slug
            }
        });

        if(!course){
            throw new UnauthorizedException();
        }

        const chapter = await this.prismaService.chapter.findFirst({
            where: {
                courseId: course.id,
                token: payload.chapter_token
            }
        });

        if(!chapter){
            throw new UnprocessableEntityException();
        }

        const lastLesson = await this.prismaService.lesson.findFirst({
            where: {
                chapterId: chapter.id
            },
            orderBy: {
                position: "desc"
            }
        });

        const newPosition = lastLesson ? lastLesson.position + 1 : 1;

        const lesson = await this.prismaService.lesson.create({
            data: {
                title: payload.title,
                chapterId: chapter.id,
                position: newPosition,
                token: new Date().getTime().toString()
            }
        });

        return this.buildLessonResponse(lesson);
    }

    async reorderLesson(payload: ReorderLessonDto): Promise<string> {
        for(let item of payload.list){
            await this.prismaService.lesson.update({
                where: {
                    id: item.id
                },
                data: {
                    position: item.position
                }
            })
        };

        return "Success";
    }

    async findLessonByToken(payload: GetLessonDto): Promise<LessonResponse>{
        const user = await this.prismaService.user.findUnique({
            where: {
                email: payload.email
            }
        });

        const course = await this.prismaService.course.findFirst({
            where: {
                owner_id: user.id,
                slug: payload.course_slug
            }
        });

        if(!course){
            throw new UnauthorizedException();
        }

        const chapter = await this.prismaService.chapter.findFirst({
            where: {
                courseId: course.id,
                token: payload.chapter_token
            }
        });

        if(!chapter){
            throw new UnprocessableEntityException();
        }

        const lesson = await this.prismaService.lesson.findFirst({
            where: {
                chapterId: chapter.id,
                token: payload.lesson_token
            }
        });

        return this.buildLessonResponse(lesson);
    }

    async updateValueLesson(payload: UpdateLessonDto): Promise<LessonResponse> {
        const user = await this.prismaService.user.findUnique({
            where: {
                email: payload.email
            }
        });

        const course = await this.prismaService.course.findFirst({
            where: {
                owner_id: user.id,
                slug: payload.course_slug
            }
        });

        if(!course){
            throw new UnauthorizedException();
        }

        const chapter = await this.prismaService.chapter.findFirst({
            where: {
                courseId: course.id,
                token: payload.chapter_token
            }
        });

        if(!chapter){
            throw new UnprocessableEntityException();
        }

        const lesson = await this.prismaService.lesson.findFirst({
            where: {
                chapterId: chapter.id,
                token: payload.lesson_token
            }
        });

        if(!lesson){
            throw new UnprocessableEntityException();
        }

        const update = await this.prismaService.lesson.update({
            where: {
                chapterId: chapter.id,
                token: payload.lesson_token
            },
            data:{
                ...payload.value
            }
        });

        return this.buildLessonResponse(update);
    }

    async updateVideoLesson(payload: UpdateVideoLesson): Promise<LessonResponse> {
        const user = await this.prismaService.user.findUnique({
            where: {
                email: payload.email
            }
        });

        const course = await this.prismaService.course.findFirst({
            where: {
                owner_id: user.id,
                slug: payload.course_slug
            }
        });

        if(!course){
            throw new UnauthorizedException();
        }

        const chapter = await this.prismaService.chapter.findFirst({
            where: {
                courseId: course.id,
                token: payload.chapter_token
            }
        });

        if(!chapter){
            throw new UnprocessableEntityException();
        }

        const lesson = await this.prismaService.lesson.findFirst({
            where: {
                chapterId: chapter.id,
                token: payload.lesson_token
            }
        });

        if(!lesson){
            throw new UnprocessableEntityException();
        }

        const {fileName, link} = this.uploadService.createFileNameVideo(payload.file);

        const data = {
            fileName: fileName,
            file: payload.file,
            lesson_id: lesson.id
        }

        const update = await this.prismaService.lesson.update({
            where: {
                chapterId: chapter.id,
                token: lesson.token
            },
            data: {
                videoUrl: link,
                isCompleteVideo: false
            }
        });
        
        await this.uploadService.uploadVideoToStorage(data);

        return this.buildLessonResponse(update);
    }

    async updateStatusLesson(payload: UpdateStatusLessonDto): Promise<LessonResponse> {
        const user = await this.prismaService.user.findUnique({
            where: {
                email: payload.email
            }
        });

        const course = await this.prismaService.course.findFirst({
            where: {
                owner_id: user.id,
                slug: payload.course_slug
            }
        });

        if(!course){
            throw new UnauthorizedException();
        }

        const chapter = await this.prismaService.chapter.findFirst({
            where: {
                courseId: course.id,
                token: payload.chapter_token
            }
        });

        if(!chapter){
            throw new UnprocessableEntityException();
        }

        const lesson = await this.prismaService.lesson.findFirst({
            where: {
                chapterId: chapter.id,
                token: payload.lesson_token
            }
        });

        if(!lesson){
            throw new UnprocessableEntityException();
        }

        const update = await this.prismaService.lesson.update({
            where: {
                chapterId: chapter.id,
                token: lesson.token
            },
            data: {
                isPublished: !payload.status
            }
        });

        return this.buildLessonResponse(update);
    }

    async deleteLesson(payload: DeleteLessonDto): Promise<string> {
        const user = await this.prismaService.user.findUnique({
            where: {
                email: payload.email
            }
        });

        const course = await this.prismaService.course.findFirst({
            where: {
                owner_id: user.id,
                slug: payload.course_slug
            }
        });

        if(!course){
            throw new UnauthorizedException();
        }

        const chapter = await this.prismaService.chapter.findFirst({
            where: {
                courseId: course.id,
                token: payload.chapter_token
            }
        });

        if(!chapter){
            throw new UnprocessableEntityException();
        }

        const lesson = await this.prismaService.lesson.findFirst({
            where: {
                chapterId: chapter.id,
                token: payload.lesson_token
            }
        });

        if(!lesson){
            throw new UnprocessableEntityException();
        }

        await this.prismaService.lesson.delete({
            where: {
                chapterId: chapter.id,
                token: lesson.token
            }
        });

        return "Success";
    }

    async updateThumbnail(payload: UpdateThumbnailVideo): Promise<LessonResponse> {
        const user = await this.prismaService.user.findUnique({
            where: {
                email: payload.email
            }
        });

        const course = await this.prismaService.course.findFirst({
            where: {
                owner_id: user.id,
                slug: payload.course_slug
            }
        });

        if(!course){
            throw new UnauthorizedException();
        }

        const chapter = await this.prismaService.chapter.findFirst({
            where: {
                courseId: course.id,
                token: payload.chapter_token
            }
        });

        if(!chapter){
            throw new UnprocessableEntityException();
        }

        const lesson = await this.prismaService.lesson.findFirst({
            where: {
                chapterId: chapter.id,
                token: payload.lesson_token
            }
        });

        if(!lesson){
            throw new UnprocessableEntityException();
        }

        const fileName = await this.uploadService.uploadAvatarToS3(payload.file);

        const update = await this.prismaService.lesson.update({
            where: {
                chapterId: chapter.id,
                token: lesson.token
            },
            data: {
                thumbnail: fileName
            }
        });
    

        return this.buildLessonResponse(update);
    }

    buildLessonResponse (lesson: Lesson): LessonResponse {
        return {
            title: lesson.title,
            token: lesson.token,
            description: lesson.description,
            position: lesson.position,
            isPublished: lesson.isPublished,
            videoUrl: lesson.videoUrl,
            isCompleteVideo: lesson.isCompleteVideo,
            thumbnail: lesson.thumbnail
            //course_title: lesson.course?.title
        }
    }
}
