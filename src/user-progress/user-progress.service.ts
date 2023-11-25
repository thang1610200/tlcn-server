import {
    Injectable,
    InternalServerErrorException,
    UnauthorizedException,
    UnprocessableEntityException,
} from '@nestjs/common';
import { UserProgressServiceInterface } from './interfaces/user-progress.service.interface';
import { PrismaService } from 'src/prisma.service';
import { GetUserProgressDto } from './dto/get-user-progress.dto';
import { Lesson, User, UserProgress, UserProgressQuiz } from '@prisma/client';
import { AddUserProgressDto } from './dto/add-user-progress.dto';
import { AddAnswerUserProgressDto } from './dto/add-answer-progress-quiz.dto';
import { GetUserProgressQuizDto } from './dto/get-user-progress-quiz.dto';
import { UpdateProgressExerciseDto } from './dto/update-progress-exercise.dto';
import { AddUserProgressNextDto } from './dto/add-user-progress-next.dto';

@Injectable()
export class UserProgressService implements UserProgressServiceInterface {
    constructor(private readonly prismaService: PrismaService) {}

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

    async findLessonByToken(token: string): Promise<Lesson> {
        const lesson = await this.prismaService.lesson.findUnique({
            where: {
                token,
            },
        });

        if (!lesson) {
            throw new UnprocessableEntityException();
        }

        return lesson;
    }

    async getUserProgress(payload: GetUserProgressDto): Promise<UserProgress> {
        const user = await this.findUserByEmail(payload.email);

        const lesson = await this.findLessonByToken(payload.lesson_token);

        const user_progress = await this.prismaService.userProgress.findFirst({
            where: {
                lessonId: lesson.id,
                userId: user.id,
            },
            include: {
                userProgressQuiz: true,
            },
        });

        return user_progress;
    }

    async addUserProgress(payload: AddUserProgressDto): Promise<UserProgress> {
        const user = await this.findUserByEmail(payload.email);

        const lesson = await this.findLessonByToken(payload.lesson_token);

        const user_progress = await this.prismaService.userProgress.upsert({
            where: {
                userId_lessonId: {
                    userId: user.id,
                    lessonId: lesson.id,
                },
            },
            create: {
                userId: user.id,
                lessonId: lesson.id,
                isCompleted: payload.isCompleted,
            },
            update: {
                isCompleted: payload.isCompleted,
            },
        });

        return user_progress;
    }

    async getUserProgressQuiz(
        payload: GetUserProgressQuizDto,
    ): Promise<UserProgressQuiz[]> {
        const result = await this.prismaService.userProgressQuiz.findMany({
            where: {
                userProgressId: payload.id,
            },
        });

        return result;
    }

    async deleteAllProgressQuiz(
        payload: GetUserProgressQuizDto,
    ): Promise<string> {
        await this.prismaService.userProgressQuiz.deleteMany({
            where: {
                userProgressId: payload.id,
            },
        });

        return 'SUCCESS';
    }

    async addAnswerProgressQuiz(
        payload: AddAnswerUserProgressDto,
    ): Promise<UserProgressQuiz> {
        const user = await this.findUserByEmail(payload.email);

        const lesson = await this.findLessonByToken(payload.lesson_token);

        const user_progress = await this.prismaService.userProgress.findFirst({
            where: {
                lessonId: lesson.id,
                userId: user.id,
            },
        });

        const result = await this.prismaService.userProgressQuiz.create({
            data: {
                quizzId: payload.quizzId,
                userProgressId: user_progress.id,
                answer: payload.answer,
                isCorrect: payload.isCorrect,
            },
        });

        return result;
    }

    async updatePrgressExerciseUser(
        payload: UpdateProgressExerciseDto,
    ): Promise<string> {
        const user = await this.findUserByEmail(payload.email);

        const lesson_next = await this.findLessonByToken(payload.lesson_next);

        const lesson = await this.findLessonByToken(payload.lessontoken);

        try {
            await this.prismaService.$transaction([
                this.prismaService.userProgress.update({
                    where: {
                        userId_lessonId: {
                            userId: user.id,
                            lessonId: lesson.id,
                        },
                    },
                    data: {
                        isPassed: true,
                    },
                }),
                this.prismaService.userProgress.create({
                    data: {
                        userId: user.id,
                        lessonId: lesson_next.id,
                    },
                }),
            ]);

            return 'SUCCESS';
        } catch (e: any) {
            throw new InternalServerErrorException();
        }
    }

    async addUserProgressNext(
        payload: AddUserProgressNextDto,
    ): Promise<string> {
        const user = await this.findUserByEmail(payload.email);

        const lesson_next = await this.findLessonByToken(payload.lesson_next);

        const lesson = await this.findLessonByToken(payload.lesson_token);

        try {
            await this.prismaService.$transaction([
                this.prismaService.userProgress.update({
                    where: {
                        userId_lessonId: {
                            userId: user.id,
                            lessonId: lesson.id,
                        },
                    },
                    data: {
                        isCompleted: true,
                    },
                }),
                this.prismaService.userProgress.create({
                    data: {
                        userId: user.id,
                        lessonId: lesson_next.id,
                    },
                }),
            ]);

            return 'SUCCESS';
        } catch (e: any) {
            throw new InternalServerErrorException();
        }
    }
}
