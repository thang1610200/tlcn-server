import {
    Injectable,
    InternalServerErrorException,
    UnauthorizedException,
    UnprocessableEntityException,
} from '@nestjs/common';
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
import { $Enums, Chapter, Course, Lesson, User } from '@prisma/client';
import { UpdateThumbnailVideo } from './dto/update-thumbnail.dto';
import { ContentLessonDto } from './dto/content-lesson.dto';

@Injectable()
export class LessonService implements LessonServiceInterface {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly uploadService: UploadService,
    ) {}
    async findChapterByToken(chapterToken: string, courseId: string): Promise<Chapter> {
        try {
            const chapter = await this.prismaService.chapter.findFirst({
                where: {
                    courseId: courseId,
                    token: chapterToken,
                },
            });
    
            if (!chapter) {
                throw new UnprocessableEntityException();
            }

            return chapter;
        }
        catch {
            throw new InternalServerErrorException();
        }
    }

    async findCourseBySlug(courseSlug: string, userId: string): Promise<Course> {
        try {
            const course = await this.prismaService.course.findFirst({
                where: {
                    owner_id: userId,
                    slug: courseSlug,
                },
            });
    
            if (!course) {
                throw new UnauthorizedException();
            }

            return course;
        }
        catch {
            throw new InternalServerErrorException();
        }
    }

    async findUserByEmail(email: string): Promise<User> {
        try {
            const user = await this.prismaService.user.findUnique({
                where: {
                    email
                }
            });

            if(!user) {
                throw new UnauthorizedException();
            }

            return user;
        }
        catch {
            throw new InternalServerErrorException();
        }
    }

    async createLesson(payload: CreateLessonDto): Promise<LessonResponse> {
        const user = await this.findUserByEmail(payload.email);

        const course = await this.findCourseBySlug(payload.course_slug, user.id);

        const chapter = await this.findChapterByToken(payload.chapter_token, course.id);
        
        try {
            const lastContent = await this.prismaService.content.findFirst({
                where: {
                    chapterId: chapter.id
                },
                orderBy: {
                    position: 'desc',
                },
            });
    
            const newPosition = lastContent ? lastContent.position + 1 : 1;
    
            const content = await this.prismaService.content.create({
                data: {
                    type: payload.type,
                    chapterId: chapter.id,
                    position: newPosition,
                }
            });
    
            const lesson = await this.prismaService.lesson.create({
                data: {
                    title: payload.title,
                    token: new Date().getTime().toString(),
                    contentId: content.id
                },
            });
    
            return this.buildLessonResponse(lesson);
        }
        catch {
            throw new InternalServerErrorException();
        }
    }

    async reorderLesson(payload: ReorderLessonDto): Promise<string> {
        for (let item of payload.list) {
            await this.prismaService.content.update({
                where: {
                    id: item.id,
                },
                data: {
                    position: item.position,
                },
            });
        }

        return 'Success';
    }

    async findLessonByToken(payload: GetLessonDto): Promise<Lesson> {
        const user = await this.findUserByEmail(payload.email);

        const course = await this.findCourseBySlug(payload.course_slug, user.id);

        const chapter = await this.findChapterByToken(payload.chapter_token, course.id);

        try {
            const lesson = await this.prismaService.lesson.findFirst({
                where: {
                    chapterId: chapter.id,
                    token: payload.lesson_token,
                },
                include: {
                    attachment: true
                },
            });

            if(!lesson) {
                throw new UnprocessableEntityException();
            }
    
            return lesson;
        }
        catch {
            throw new InternalServerErrorException();
        }
    }

    async updateValueLesson(payload: UpdateLessonDto): Promise<LessonResponse> {
        const user = await this.prismaService.user.findUnique({
            where: {
                email: payload.email,
            },
        });

        const course = await this.prismaService.course.findFirst({
            where: {
                owner_id: user.id,
                slug: payload.course_slug,
            },
        });

        if (!course) {
            throw new UnprocessableEntityException();
        }

        const chapter = await this.prismaService.chapter.findFirst({
            where: {
                courseId: course.id,
                token: payload.chapter_token,
            },
        });

        if (!chapter) {
            throw new UnprocessableEntityException();
        }

        const lesson = await this.prismaService.lesson.findFirst({
            where: {
                chapterId: chapter.id,
                token: payload.lesson_token,
            },
        });

        if (!lesson) {
            throw new UnprocessableEntityException();
        }

        const update = await this.prismaService.lesson.update({
            where: {
                chapterId: chapter.id,
                token: payload.lesson_token,
            },
            data: {
                ...payload.value,
            },
        });

        return this.buildLessonResponse(update);
    }

    async updateVideoLesson(
        payload: UpdateVideoLesson,
    ): Promise<LessonResponse> {
        const user = await this.prismaService.user.findUnique({
            where: {
                email: payload.email,
            },
        });

        const course = await this.prismaService.course.findFirst({
            where: {
                owner_id: user.id,
                slug: payload.course_slug,
            },
        });

        if (!course) {
            throw new UnauthorizedException();
        }

        const chapter = await this.prismaService.chapter.findFirst({
            where: {
                courseId: course.id,
                token: payload.chapter_token,
            },
        });

        if (!chapter) {
            throw new UnprocessableEntityException();
        }

        const lesson = await this.prismaService.lesson.findFirst({
            where: {
                chapterId: chapter.id,
                token: payload.lesson_token,
            },
        });

        if (!lesson) {
            throw new UnprocessableEntityException();
        }

        const { fileName, link } = this.uploadService.createFileNameVideo(
            payload.file,
        );

        const data = {
            fileName,
            file: payload.file,
            lesson_id: lesson.id,
            link,
        };

        const update = await this.prismaService.lesson.update({
            where: {
                chapterId: chapter.id,
                token: lesson.token,
            },
            data: {
                videoUrl: link,
                isCompleteVideo: false,
            },
        });

        await this.uploadService.uploadVideoToStorage(data);

        return this.buildLessonResponse(update);
    }

    async updateStatusLesson(
        payload: UpdateStatusLessonDto,
    ): Promise<LessonResponse> {
        const user = await this.prismaService.user.findUnique({
            where: {
                email: payload.email,
            },
        });

        const course = await this.prismaService.course.findFirst({
            where: {
                owner_id: user.id,
                slug: payload.course_slug,
            },
        });

        if (!course) {
            throw new UnauthorizedException();
        }

        const chapter = await this.prismaService.chapter.findFirst({
            where: {
                courseId: course.id,
                token: payload.chapter_token,
            },
        });

        if (!chapter) {
            throw new UnprocessableEntityException();
        }

        const lesson = await this.prismaService.lesson.findFirst({
            where: {
                chapterId: chapter.id,
                token: payload.lesson_token,
            },
        });

        if (!lesson) {
            throw new UnprocessableEntityException();
        }

        const update = await this.prismaService.lesson.update({
            where: {
                chapterId: chapter.id,
                token: lesson.token,
            },
            data: {
                isPublished: !payload.status,
            },
        });

        return this.buildLessonResponse(update);
    }

    async deleteLesson(payload: DeleteLessonDto): Promise<string> {
        const user = await this.prismaService.user.findUnique({
            where: {
                email: payload.email,
            },
        });

        const course = await this.prismaService.course.findFirst({
            where: {
                owner_id: user.id,
                slug: payload.course_slug,
            },
        });

        if (!course) {
            throw new UnauthorizedException();
        }

        const chapter = await this.prismaService.chapter.findFirst({
            where: {
                courseId: course.id,
                token: payload.chapter_token,
            },
        });

        if (!chapter) {
            throw new UnprocessableEntityException();
        }

        const lesson = await this.prismaService.lesson.findFirst({
            where: {
                chapterId: chapter.id,
                token: payload.lesson_token,
            },
        });

        if (!lesson) {
            throw new UnprocessableEntityException();
        }

        await this.prismaService.lesson.delete({
            where: {
                chapterId: chapter.id,
                token: lesson.token,
            },
        });

        return 'Success';
    }

    async updateThumbnail(
        payload: UpdateThumbnailVideo,
    ): Promise<LessonResponse> {
        const user = await this.prismaService.user.findUnique({
            where: {
                email: payload.email,
            },
        });

        if (!user) {
            throw new UnauthorizedException();
        }

        const course = await this.prismaService.course.findFirst({
            where: {
                owner_id: user.id,
                slug: payload.course_slug,
            },
        });

        if (!course) {
            throw new UnauthorizedException();
        }

        const chapter = await this.prismaService.chapter.findFirst({
            where: {
                courseId: course.id,
                token: payload.chapter_token,
            },
        });

        if (!chapter) {
            throw new UnprocessableEntityException();
        }

        const lesson = await this.prismaService.lesson.findFirst({
            where: {
                chapterId: chapter.id,
                token: payload.lesson_token,
            },
        });

        if (!lesson) {
            throw new UnprocessableEntityException();
        }

        const fileName = await this.uploadService.uploadAvatarToS3(
            payload.file,
        );

        const update = await this.prismaService.lesson.update({
            where: {
                chapterId: chapter.id,
                token: lesson.token,
            },
            data: {
                thumbnail: fileName,
            },
        });

        return this.buildLessonResponse(update);
    }

    async contentLesson(payload: ContentLessonDto): Promise<Lesson> {
        const user = await this.prismaService.user.findUnique({
            where: {
                email: payload.email,
            },
        });

        if (!user) {
            throw new UnauthorizedException();
        }

        const course = await this.prismaService.course.findFirst({
            where: {
                slug: payload.course_slug,
            },
        });

        if (!course) {
            throw new UnauthorizedException();
        }

        const lesson = await this.prismaService.lesson.findUnique({
            where: {
                token: payload.lesson_token,
            },
            include: {
                attachment: true,
                exercise: {
                    where: {
                        isOpen: true,
                    },
                    include: {
                        quizz: {
                            where: {
                                isPublished: true,
                            },
                        },
                    },
                },
                userProgress: {
                    where: {
                        userId: user.id,
                    },
                    include: {
                        userProgressQuiz: {
                            orderBy: {
                                createdAt: 'desc',
                            },
                        },
                    },
                },
            },
        });

        if (!lesson) {
            throw new UnauthorizedException();
        }

        return lesson;
    }

    buildLessonResponse(lesson: Lesson): LessonResponse {
        return {
            title: lesson.title,
            token: lesson.token,
            description: lesson.description,
            isPublished: lesson.isPublished,
            videoUrl: lesson.videoUrl,
            isCompleteVideo: lesson.isCompleteVideo,
            thumbnail: lesson.thumbnail,
            //course_title: lesson.course?.title
        };
    }
}
