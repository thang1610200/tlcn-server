import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException,
    UnprocessableEntityException,
} from '@nestjs/common';
import { UserProgressServiceInterface } from './interfaces/user-progress.service.interface';
import { PrismaService } from 'src/prisma.service';
import { Content, Course, Lesson, User, UserProgress, UserProgressQuiz } from '@prisma/client';
import { AddUserProgressDto, CompleteLessonDto } from './dto/user-progress.dto';
@Injectable()
export class UserProgressService implements UserProgressServiceInterface {
    constructor(private readonly prismaService: PrismaService) {}

    async findContentOfCourse(token: string, courseId: string): Promise<Content> {
        try {
            const content = await this.prismaService.content.findFirst({
                where: {
                    chapter: {
                        courseId
                    },
                    token
                }
            });

            if(!content) {
                throw new BadRequestException();
            }

            return content;
        }
        catch {
            throw new InternalServerErrorException();
        }
    }

    async completeLesson(payload: CompleteLessonDto): Promise<UserProgress> {
        const course = await this.findCourseBySlug(payload.course_slug);
        const user = await this.findUserByEmail(payload.email);
        const content_current = await this.findContentOfCourse(payload.content_token, course.id);
        try {
            return await this.prismaService.$transaction(async (tx) => {
                const contentUpdated = await tx.userProgress.update({
                    where: {
                        userId_contentId: {
                            userId: user.id,
                            contentId: content_current.id
                        },
                        courseId: course.id
                    },
                    data: {
                        isCompleted: true
                    }
                });

                if(payload.next_content_token) {
                    const content_next = await this.findContentOfCourse(payload.next_content_token, course.id);

                    await tx.userProgress.create({
                        data: {
                            courseId: course.id,
                            userId: user.id,
                            contentId: content_next.id
                        }
                    });
                };

                return contentUpdated;
            });
        }
        catch {
            throw new InternalServerErrorException();
        }
    }

    async findCourseBySlug(slug: string): Promise<{ id: string; topic_id: string; owner_id: string; chapters: & { contents: Content[] }[]; title: string; description: string; learning_outcome: string[]; requirement: string[]; slug: string; picture: string; isPublished: boolean; create_at: Date; update_at: Date; }> {
        const course = await this.prismaService.course.findUnique({
            where: {
                slug
            },
            include: {
                chapters: {
                    include: {
                        contents: true
                    }
                }
            }
        });

        if(!course) {
            throw new NotFoundException();
        }

        return course;
    }

    async findUserByEmail(email: string): Promise<User> {
        const user = await this.prismaService.user.findUnique({
            where: {
                email,
            },
        });

        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }

    async getUserProgressByCourse(courseId: string, userId: string): Promise<UserProgress[]> {
        try {
            const userProgress = await this.prismaService.userProgress.findMany({
                where: {
                    userId,
                    courseId
                }
            })

            return userProgress
        }
        catch {
            throw new InternalServerErrorException();
        }
    }

    async addUserProgress(payload: AddUserProgressDto): Promise<Course> {
        const user = await this.findUserByEmail(payload.email);

        const course = await this.findCourseBySlug(payload.course_slug);

        const course_progress = await this.getUserProgressByCourse(course.id, user.id);

        try { 
            if (course_progress.length > 0 || user.id === course.owner_id) {
                return course;
            }

            await this.prismaService.userProgress.create({
                data: {
                    courseId: course.id,
                    userId: user.id,
                    contentId: course.chapters[0].contents[0].id
                }
            });

            return course;
        }
        catch{
            throw new InternalServerErrorException();
        }
    }

    // async getUserProgressQuiz(
    //     payload: GetUserProgressQuizDto,
    // ): Promise<UserProgressQuiz[]> {
    //     const result = await this.prismaService.userProgressQuiz.findMany({
    //         where: {
    //             userProgressId: payload.id,
    //         },
    //     });

    //     return result;
    // }

    // async deleteAllProgressQuiz(
    //     payload: GetUserProgressQuizDto,
    // ): Promise<string> {
    //     await this.prismaService.userProgressQuiz.deleteMany({
    //         where: {
    //             userProgressId: payload.id,
    //         },
    //     });

    //     return 'SUCCESS';
    // }

    // async addAnswerProgressQuiz(
    //     payload: AddAnswerUserProgressDto,
    // ): Promise<UserProgressQuiz> {
    //     const user = await this.findUserByEmail(payload.email);

    //     const lesson = await this.findLessonByToken(payload.lesson_token);

    //     const user_progress = await this.prismaService.userProgress.findFirst({
    //         where: {
    //             lessonId: lesson.id,
    //             userId: user.id,
    //         },
    //     });

    //     const result = await this.prismaService.userProgressQuiz.create({
    //         data: {
    //             quizzId: payload.quizzId,
    //             userProgressId: user_progress.id,
    //             answer: payload.answer,
    //             isCorrect: payload.isCorrect,
    //         },
    //     });

    //     return result;
    // }

    // async updatePrgressExerciseUser(
    //     payload: UpdateProgressExerciseDto,
    // ): Promise<string> {
    //     try {
    //         const user = await this.findUserByEmail(payload.email);

    //         const lesson_next = await this.findLessonByToken(payload.lesson_next);
    
    //         const lesson = await this.findLessonByToken(payload.lessontoken);

    //         const course = await this.findCourseBySlug(payload.course_slug);

    //         await this.prismaService.$transaction([
    //             this.prismaService.userProgress.update({
    //                 where: {
    //                     userId_lessonId: {
    //                         userId: user.id,
    //                         lessonId: lesson.id,
    //                     },
    //                 },
    //                 data: {
    //                     isPassed: true,
    //                 },
    //             }),
    //             this.prismaService.userProgress.create({
    //                 data: {
    //                     courseId: course.id,
    //                     userId: user.id,
    //                     lessonId: lesson_next.id,
    //                 },
    //             }),
    //         ]);

    //         return 'SUCCESS';
    //     } catch (e: any) {
    //         throw new InternalServerErrorException();
    //     }
    // }

    // async addUserProgressNext(
    //     payload: AddUserProgressNextDto,
    // ): Promise<string> {
    //     try {
    //         const user = await this.findUserByEmail(payload.email);

    //         const lesson_next = await this.findLessonByToken(payload.lesson_next);
    
    //         const lesson = await this.findLessonByToken(payload.lesson_token);

    //         const course = await this.findCourseBySlug(payload.course_slug);

    //         await this.prismaService.$transaction([
    //             this.prismaService.userProgress.update({
    //                 where: {
    //                     userId_lessonId: {
    //                         userId: user.id,
    //                         lessonId: lesson.id,
    //                     },
    //                 },
    //                 data: {
    //                     isCompleted: true,
    //                 },
    //             }),
    //             this.prismaService.userProgress.create({
    //                 data: {
    //                     courseId: course.id,
    //                     userId: user.id,
    //                     lessonId: lesson_next.id,
    //                 },
    //             }),
    //         ]);

    //         return 'SUCCESS';
    //     } catch (e: any) {
    //         throw new InternalServerErrorException();
    //     }
    // }
}
