import {
    Injectable,
    InternalServerErrorException,
    UnauthorizedException,
    UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { Chapter, Course } from '@prisma/client';
import { ChapterServiceInterface } from './interfaces/chapter.service.interface';
import { ReorderChapterDto } from './dto/reorder-chapter.dto';
import { FindChapterDto } from './dto/find-chapter.dto';
import { ChapterResponse } from './dto/chapter-response.dto';
import { UpdateValueChapterDto } from './dto/update-chapter.dto';
import { UpdateStatusChapterDto } from './dto/update-status.dto';
import { DeleteChapterDto } from './dto/delete-chapter.dto';

@Injectable()
export class ChapterService implements ChapterServiceInterface {
    constructor(private readonly prismaService: PrismaService) {}

    async updatePositionChapter(courseId: string, position: number): Promise<string> {
        const chapters = await this.prismaService.chapter.findMany({
            where: {
                courseId,
                position: {
                    gt: position,
                },
            },
            orderBy: {
                position: "asc"
            }
        });

        chapters.forEach(async (item) => {
            await this.prismaService.chapter.update({
                where: {
                    id: item.id,
                },
                data: {
                    position: item.position - 1,
                },
            });
        });

        return 'SUCCESS';
    }

    async deleteChapter(payload: DeleteChapterDto): Promise<string> {
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
                token: payload.token,
            },
        });

        if (!chapter) {
            throw new UnprocessableEntityException();
        }
        try {
            return this.prismaService.$transaction(async (tx) => {
                const chapterDeleted = await this.prismaService.chapter.delete({
                    where: {
                        courseId: course.id,
                        token: payload.token,
                    },
                });
    
                return await this.updatePositionChapter(course.id, chapterDeleted.position);
            });
        }
        catch {
            throw new InternalServerErrorException();
        }
    }

    async findCourseBySlug(slug: string, email: string): Promise<Course> {
        const user = await this.prismaService.user.findUnique({
            where: {
                email,
            },
        });

        if (!user) {
            throw new UnauthorizedException();
        }

        return await this.prismaService.course.findFirst({
            where: {
                slug,
                owner_id: user.id,
            },
        });
    }

    async updateStatusChapter(
        payload: UpdateStatusChapterDto,
    ): Promise<ChapterResponse> {
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
                token: payload.token,
            },
        });

        if (!chapter) {
            throw new UnprocessableEntityException();
        }

        const update = await this.prismaService.chapter.update({
            where: {
                courseId: course.id,
                token: payload.token,
            },
            data: {
                isPublished: !payload.status,
            },
        });

        return this.buidResponseChapter(update);
    }

    async createChapter(payload: CreateChapterDto): Promise<Chapter> {
        const course = await this.findCourseBySlug(payload.slug, payload.email);

        if (!course) {
            throw new UnprocessableEntityException();
        }

        const lastChapter = await this.prismaService.chapter.findFirst({
            where: {
                courseId: course.id,
            },
            orderBy: {
                position: 'desc',
            },
        });

        const newPosition = lastChapter ? lastChapter.position + 1 : 1;

        return await this.prismaService.chapter.create({
            data: {
                title: payload.title,
                courseId: course.id,
                token: new Date().getTime().toString(),
                position: newPosition,
            },
        });
    }

    async reorderChapter(payload: ReorderChapterDto): Promise<string> {
        const user = await this.prismaService.user.findUnique({
            where: {
                email: payload.email,
            },
        });

        const course = await this.prismaService.course.findFirst({
            where: {
                slug: payload.courseSlug,
                owner_id: user.id,
            },
        });

        if (!course) {
            throw new UnauthorizedException();
        }

        for (let item of payload.list) {
            await this.prismaService.chapter.update({
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

    async findChapterByToken(payload: FindChapterDto): Promise<Chapter> {
        const course = await this.findCourseBySlug(
            payload.course_slug,
            payload.email,
        );

        if (!course) {
            throw new UnauthorizedException();
        }

        return await this.prismaService.chapter.findFirst({
            where: {
                courseId: course.id,
                token: payload.token,
            },
            include: {
                course: true,
                contents: {
                    include: {
                        lesson: true,
                        exercise: true
                    },
                    orderBy: {
                        position: 'asc',
                    },
                },
            },
        });
    }

    async updateValueChapter(
        payload: UpdateValueChapterDto,
    ): Promise<ChapterResponse> {
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
                token: payload.token,
            },
        });

        if (!chapter) {
            throw new UnprocessableEntityException();
        }

        const update = await this.prismaService.chapter.update({
            where: {
                courseId: course.id,
                token: payload.token,
            },
            data: {
                ...payload.value,
            },
        });

        return this.buidResponseChapter(update);
    }

    buidResponseChapter(chapter: Chapter): ChapterResponse {
        return {
            title: chapter.title,
            token: chapter.token,
            description: chapter.description,
            position: chapter.position,
            isPublished: chapter.isPublished,
        };
    }
}
